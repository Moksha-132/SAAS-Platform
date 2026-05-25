import React, { useState, useEffect, useRef } from 'react';
import UserSidebar from '../components/UserSidebar';
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { 
  Send, Paperclip, Smile, Phone, Video, Search, User, 
  ChevronRight, Download, File, X, PhoneCall, PhoneOff, 
  Mic, MicOff, Volume2, VolumeX, Calendar, Clock, ArrowRight,
  ExternalLink, VideoOff, Monitor, MessageSquare, Hand, MoreVertical
} from 'lucide-react';

const UserChat = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCall, setActiveCall] = useState(null); // 'ringing', 'connected', null
  const [callType, setCallType] = useState('audio'); // 'audio' | 'video'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Video Call & Meeting scheduling state
  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [liveMeetingId, setLiveMeetingId] = useState(null); // When set, active Google Meet UI
  
  // Custom Google Meet simulation controls
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [meetingChatOpen, setMeetingChatOpen] = useState(false);
  const [meetingChatText, setMeetingChatText] = useState('');
  const [meetingChatMessages, setMeetingChatMessages] = useState([
    { sender: 'System', text: 'Welcome to Google Meet! This call is private and secure.' }
  ]);

  // Real-time WebRTC Peer Connection States
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [isRemoteCameraOn, setIsRemoteCameraOn] = useState(true);
  const [isRemoteMicOn, setIsRemoteMicOn] = useState(true);
  const [isRemoteHandRaised, setIsRemoteHandRaised] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const callTimerRef = useRef(null);
  const dropdownRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const iceCandidatesQueueRef = useRef([]);
  const screenStreamRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowVideoDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const flushIceCandidates = async () => {
    if (peerRef.current && peerRef.current.remoteDescription) {
      console.log(`WebRTC: Flushing ${iceCandidatesQueueRef.current.length} queued ICE candidates`);
      for (const candidate of iceCandidatesQueueRef.current) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding queued ICE candidate:', err);
        }
      }
      iceCandidatesQueueRef.current = [];
    }
  };

  // Initialize socket connection and listen to WebRTC signaling
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket']
    });

    if (user.id) {
      socketRef.current.emit('join_room', user.id);
    }

    // Direct chat message receiver
    socketRef.current.on('receive_message', (msg) => {
      if (selectedPartner && (msg.sender_id === selectedPartner.id || msg.receiver_id === selectedPartner.id)) {
        setMessages(prev => [...prev, msg]);
      } else {
        setPartners(prev => prev.map(p => {
          if (p.id === msg.sender_id) {
            return { ...p, unread_count: (p.unread_count || 0) + 1 };
          }
          return p;
        }));
      }
    });

    // WebRTC Signaling receiver: call_incoming
    socketRef.current.on('call_incoming', async (data) => {
      console.log('WebRTC: Call incoming from peer');
      if (!peerRef.current) {
        await initWebRTC(false);
      }
      try {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        socketRef.current.emit('accept_call', {
          to: data.from,
          answer: peerRef.current.localDescription
        });
        await flushIceCandidates();
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    });

    // WebRTC Signaling receiver: call_accepted
    socketRef.current.on('call_accepted', async (data) => {
      console.log('WebRTC: Call accepted by peer');
      if (peerRef.current) {
        try {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          await flushIceCandidates();
          setIsPeerConnected(true);
        } catch (err) {
          console.error('Error setting WebRTC answer:', err);
        }
      }
    });

    // WebRTC Signaling receiver: ice_candidate
    socketRef.current.on('ice_candidate', async (data) => {
      if (peerRef.current && peerRef.current.remoteDescription) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      } else {
        iceCandidatesQueueRef.current.push(data.candidate);
      }
    });

    // Handle incoming meeting controls (camera, mic, hand rise, chat)
    socketRef.current.on('meeting_signal', (data) => {
      console.log('WebRTC: Received meeting signal:', data);
      if (data.type === 'camera') {
        setIsRemoteCameraOn(data.payload.enabled);
      } else if (data.type === 'mic') {
        setIsRemoteMicOn(data.payload.enabled);
      } else if (data.type === 'hand') {
        setIsRemoteHandRaised(data.payload.raised);
      } else if (data.type === 'chat') {
        setMeetingChatMessages(prev => [...prev, { sender: data.payload.sender, text: data.payload.text }]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedPartner]);

  // Handle local webcam stream for Google Meet simulation
  useEffect(() => {
    if (liveMeetingId) {
      // Access webcam and mic
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.error("Camera access failed or blocked:", err);
          });
      }
    } else {
      // Clean up camera stream and Peer Connection when leaving call
      leaveGoogleMeet();
    }
  }, [liveMeetingId]);

  // Initialize WebRTC peer connection
  const initWebRTC = async (isCaller) => {
    try {
      if (peerRef.current) return;

      // Ensure local webcam stream is active before negotiating peer connection
      if (!localStreamRef.current) {
        console.log("WebRTC: Local stream not ready, acquiring media device access first...");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("WebRTC: Failed to acquire stream during connection initialization:", err);
          return;
        }
      }

      peerRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local camera/mic tracks to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerRef.current.addTrack(track, localStreamRef.current);
        });
      }

      // Handle incoming remote audio/video tracks
      peerRef.current.ontrack = (event) => {
        console.log('WebRTC: Remote track received', event.streams[0]);
        setIsPeerConnected(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidate generation
      peerRef.current.onicecandidate = (event) => {
        if (event.candidate && selectedPartner) {
          socketRef.current.emit('ice_candidate', {
            to: selectedPartner.id,
            candidate: event.candidate
          });
        }
      };

      // If we are the initiating dialer
      if (isCaller && selectedPartner) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);
        
        socketRef.current.emit('call_user', {
          to: selectedPartner.id,
          offer: peerRef.current.localDescription,
          callerId: user.id
        });
      }
    } catch (error) {
      console.error("WebRTC initialization failed:", error);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch partners
  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chats/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPartners(data.partners);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Fetch chat history
  useEffect(() => {
    if (!selectedPartner) return;
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/chats/history/${selectedPartner.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.history);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [selectedPartner]);

  // Call timer effect
  useEffect(() => {
    if (activeCall === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(callTimerRef.current);
  }, [activeCall]);

  const handlePartnerSelect = (p) => {
    setSelectedPartner(p);
    setPartners(prev => prev.map(item => {
      if (item.id === p.id) {
        return { ...item, unread_count: 0 };
      }
      return item;
    }));
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedPartner) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chats/message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedPartner.id,
          message: newMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.chat]);
        setNewMessage('');
        setShowEmojiPicker(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedPartner) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadRes = await fetch('http://localhost:5000/api/managers/upload-document', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      
      if (uploadResult.success) {
        const chatRes = await fetch('http://localhost:5000/api/chats/message', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: selectedPartner.id,
            message: `Attachment: ${file.name}`,
            fileUrl: uploadResult.documentUrl,
            fileName: file.name
          })
        });
        const chatData = await chatRes.json();
        if (chatData.success) {
          setMessages(prev => [...prev, chatData.chat]);
        }
      } else {
        alert(uploadResult.message || 'File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Unable to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Immediate Call posting
  const handleImmediateCall = async () => {
    if (!selectedPartner) return;
    const callRoomId = Math.random().toString(36).substring(2, 12);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chats/message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedPartner.id,
          message: `🎥 JOIN IMMEDIATE VIDEO CALL | ${callRoomId}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.chat]);
        setShowVideoDropdown(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule meeting form submit
  const handleScheduleMeetingSubmit = async (e) => {
    e.preventDefault();
    if (!meetingTitle || !meetingTime || !selectedPartner) return;

    const callRoomId = Math.random().toString(36).substring(2, 12);
    const meetingMessage = `📅 MEETING SCHEDULED: ${meetingTitle} | ${new Date(meetingTime).toLocaleString()} | ${callRoomId}`;

    try {
      const token = localStorage.getItem('token');
      
      const chatRes = await fetch('http://localhost:5000/api/chats/message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedPartner.id,
          message: meetingMessage
        })
      });
      const chatData = await chatRes.json();
      
      if (chatData.success) {
        setMessages(prev => [...prev, chatData.chat]);
        
        await fetch('http://localhost:5000/api/chats/meetings/schedule', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            chatId: chatData.chat.id,
            title: meetingTitle,
            scheduledTime: meetingTime,
            meetingLink: `https://meet.google.com/${callRoomId.substring(0,3)}-${callRoomId.substring(3,7)}-${callRoomId.substring(7)}`
          })
        });

        setMeetingTitle('');
        setMeetingTime('');
        setShowScheduleModal(false);
        setShowVideoDropdown(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startCall = (type) => {
    setCallType(type);
    setActiveCall('ringing');
    setTimeout(() => {
      setActiveCall('connected');
    }, 3000);
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Google Meet controller toggles
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const nextVal = !isCameraOn;
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = nextVal;
      });
      setIsCameraOn(nextVal);
      if (selectedPartner && socketRef.current) {
        socketRef.current.emit('meeting_signal', {
          to: selectedPartner.id,
          type: 'camera',
          payload: { enabled: nextVal }
        });
      }
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const nextVal = !isMicOn;
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = nextVal;
      });
      setIsMicOn(nextVal);
      if (selectedPartner && socketRef.current) {
        socketRef.current.emit('meeting_signal', {
          to: selectedPartner.id,
          type: 'mic',
          payload: { enabled: nextVal }
        });
      }
    }
  };

  const handleSendMeetingChat = (e) => {
    e.preventDefault();
    if (!meetingChatText.trim()) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const text = meetingChatText;
    const senderName = user.company_name || user.email || 'Client User';

    setMeetingChatMessages(prev => [...prev, { sender: 'You', text }]);
    setMeetingChatText('');

    if (selectedPartner && socketRef.current) {
      socketRef.current.emit('meeting_signal', {
        to: selectedPartner.id,
        type: 'chat',
        payload: { sender: senderName, text }
      });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        
        // Find video sender to replace track
        if (peerRef.current) {
          const senders = peerRef.current.getSenders();
          const videoSender = senders.find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            const screenTrack = screenStream.getVideoTracks()[0];
            await videoSender.replaceTrack(screenTrack);
          }
        }
        
        // Update local video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        // Listen for stop sharing event
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare(screenStream);
        };
      } else {
        // Stop screen sharing
        stopScreenShare(screenStreamRef.current);
      }
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  const stopScreenShare = async (screenStream) => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    screenStreamRef.current = null;
    
    // Put local camera stream back
    if (localStreamRef.current) {
      if (peerRef.current) {
        const senders = peerRef.current.getSenders();
        const videoSender = senders.find(s => s.track && s.track.kind === 'video');
        if (videoSender) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          await videoSender.replaceTrack(cameraTrack);
        }
      }
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
    
    setIsScreenSharing(false);
  };

  const leaveGoogleMeet = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    setIsPeerConnected(false);
    setLiveMeetingId(null);
    setIsRemoteCameraOn(true);
    setIsRemoteMicOn(true);
    setIsRemoteHandRaised(false);
    setIsScreenSharing(false);
    iceCandidatesQueueRef.current = [];
  };

  const filteredPartners = partners.filter(p => 
    p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <UserSidebar />
      
      <div className="flex-grow ml-64 p-8 lg:p-12 bg-slate-50 h-screen flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Chat</h1>
          <p className="text-slate-500 font-medium">Connect directly with product managers and specialists.</p>
        </div>

        <div className="flex-grow bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/40 flex overflow-hidden min-h-0">
          {/* Chat List sidebar */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search managers..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm" 
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-grow divide-y divide-slate-50">
              {filteredPartners.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No active contacts found.
                </div>
              ) : (
                filteredPartners.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handlePartnerSelect(p)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors relative ${
                      selectedPartner?.id === p.id ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309] font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-slate-900 truncate">{p.company_name || 'Manager'}</p>
                      <p className="text-xs text-slate-400 truncate">{p.email}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {p.unread_count > 0 && (
                        <span className="bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                          {p.unread_count}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Chat dialog screen */}
          <div className="w-2/3 flex flex-col bg-slate-50/40 relative">
            {selectedPartner ? (
              <>
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309] font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{selectedPartner.company_name || 'Manager'}</h3>
                      <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Active Support
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setShowVideoDropdown(!showVideoDropdown)}
                      className={`p-2.5 rounded-xl transition-colors border ${
                        showVideoDropdown 
                          ? 'bg-[#b45309] text-white border-[#b45309]' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100'
                      }`}
                      title="Video Meeting Options"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    {/* WhatsApp-Style Video Dropdown */}
                    {showVideoDropdown && (
                      <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl w-60 z-50 overflow-hidden py-1.5">
                        <button 
                          onClick={handleImmediateCall}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-slate-800 flex items-center gap-3 text-sm font-bold transition-colors"
                        >
                          <Video className="w-4 h-4 text-green-600" />
                          Immediate Call
                        </button>
                        <button 
                          onClick={() => {
                            setShowScheduleModal(true);
                            setShowVideoDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-slate-800 flex items-center gap-3 text-sm font-bold transition-colors border-t border-slate-100"
                        >
                          <Calendar className="w-4 h-4 text-amber-600" />
                          Schedule a Meeting
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => {
                    const isSelf = msg.sender_id !== selectedPartner.id;
                    const isImmediateCall = msg.message.startsWith('🎥 JOIN IMMEDIATE VIDEO CALL');
                    const isScheduledMeeting = msg.message.startsWith('📅 MEETING SCHEDULED:');

                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        {isImmediateCall ? (
                          /* WhatsApp-Style Glowing Call Card */
                          <div className={`p-5 rounded-3xl shadow-md border max-w-[80%] flex flex-col gap-4 bg-white border-green-200/80`}>
                            <div className="flex items-start gap-4">
                              <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl animate-pulse">
                                <Video className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-sm">Immediate Video Call</h4>
                                <p className="text-xs text-slate-500 mt-1">Launched Google Meet. Tap below to connect instantly.</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setLiveMeetingId(msg.message.split('|')[1].trim())}
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
                            >
                              <PhoneCall className="w-4 h-4 animate-bounce" /> Join Video Call
                            </button>
                          </div>
                        ) : isScheduledMeeting ? (
                          /* WhatsApp-Style Calendar Meeting Card */
                          (() => {
                            const parts = msg.message.split('|');
                            const title = parts[0].replace('📅 MEETING SCHEDULED:', '').trim();
                            const timeStr = parts[1]?.trim() || '';
                            const mId = parts[2]?.trim() || 'meeting';
                            
                            return (
                              <div className={`p-5 rounded-3xl shadow-md border max-w-[80%] flex flex-col gap-4 bg-white border-amber-200/80`}>
                                <div className="flex items-start gap-4">
                                  <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
                                    <Calendar className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-slate-900 text-sm">Scheduled Meeting</h4>
                                    <p className="text-xs font-bold text-[#b45309] mt-1">{title}</p>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{timeStr}</span>
                                    </div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setLiveMeetingId(mId)}
                                  className="w-full bg-[#b45309] hover:bg-amber-800 text-white py-2.5 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
                                >
                                  <ExternalLink className="w-4 h-4" /> Join Scheduled Meeting
                                </button>
                              </div>
                            );
                          })()
                        ) : (
                          /* Standard message card */
                          <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                            isSelf 
                              ? 'bg-[#0F172A] text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}>
                            {msg.file_url ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 bg-slate-100/10 p-2.5 rounded-xl border border-slate-200/20">
                                  <File className={`w-8 h-8 ${isSelf ? 'text-white' : 'text-[#b45309]'}`} />
                                  <div className="min-w-0">
                                    <p className="font-bold truncate text-xs">{msg.file_name || 'Attached File'}</p>
                                    <p className="text-[10px] text-slate-400">Ready to download</p>
                                  </div>
                                </div>
                                <a 
                                  href={msg.file_url} 
                                  download 
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`text-xs font-bold flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-colors ${
                                    isSelf 
                                      ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                                      : 'bg-[#b45309] hover:bg-amber-800 border-[#b45309] text-white'
                                  }`}
                                >
                                  <Download className="w-3.5 h-3.5" /> Download File
                                </a>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                            )}
                            <span className="text-[9px] opacity-65 block mt-2 text-right">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 relative">
                  {showEmojiPicker && (
                    <div className="absolute bottom-20 left-4 z-50 shadow-2xl">
                      <EmojiPicker 
                        onEmojiClick={(emojiData) => {
                          setNewMessage(prev => prev + emojiData.emoji);
                        }}
                      />
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden" 
                      accept=".pdf,.zip,.rar,.docx,.txt,.png,.jpg,.jpeg"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="p-2.5 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors border border-slate-200"
                      title="Attach File"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2.5 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors border border-slate-200"
                      title="Emoji Panel"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    <input 
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={isUploading ? "Uploading attachment..." : "Type your message..."}
                      disabled={isUploading}
                      className="flex-grow px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm" 
                    />

                    <button 
                      type="submit"
                      className="p-2.5 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl shadow-md transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
                <User className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Chat Selected</h3>
                <p className="text-sm">Select a support manager from the contacts panel to begin chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HYPER-REALISTIC CUSTOM GOOGLE MEET CLONE INTERFACE (REAL WEBRTC CORE)    */}
      {/* ========================================================================= */}
      {liveMeetingId && (
        <div className="fixed inset-0 bg-[#202124] z-[300] flex flex-col text-white select-none animate-fade-in font-sans">
          {/* Main call workspace */}
          <div className="flex-grow flex p-6 gap-6 relative min-h-0">
            {/* Left side: Video grid stream container */}
            <div className="flex-grow flex flex-col md:flex-row gap-4 items-center justify-center min-w-0">
              
              {/* Partner Stream Video Tile (Real WebRTC connection frame) */}
              <div className="flex-grow w-full md:w-1/2 h-full bg-[#3c4043] rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-700 shadow-xl max-h-[80vh]">
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-cover rounded-3xl ${(!isPeerConnected || !isRemoteCameraOn) ? 'hidden' : ''}`}
                />
                
                {!isRemoteCameraOn && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg border border-slate-800">
                      {selectedPartner?.company_name?.[0] || 'M'}
                    </div>
                    <p className="text-sm font-bold text-slate-400">Camera turned off</p>
                  </div>
                )}
                
                {!isPeerConnected && isRemoteCameraOn && (
                  <div className="flex flex-col items-center gap-4 text-center px-6">
                    <div className="w-24 h-24 bg-[#b45309]/80 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg animate-pulse">
                      {selectedPartner?.company_name?.[0] || 'M'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-300">
                        {selectedPartner?.company_name || 'Manager'} has not dialed yet.
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Both users must join to connect streams.</p>
                    </div>
                    <button 
                      onClick={() => initWebRTC(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3 rounded-full text-xs transition-colors tracking-wider uppercase shadow-lg border border-green-500 animate-bounce flex items-center gap-2"
                    >
                      ⚡ Connect Camera Stream
                    </button>
                  </div>
                )}
                
                {/* Tile bottom left label */}
                <span className="absolute bottom-4 left-4 bg-black/60 px-4 py-1.5 rounded-xl text-xs font-bold border border-white/5 flex items-center gap-2">
                  {selectedPartner?.company_name || 'Manager'}{' '}
                  {isRemoteMicOn ? (
                    <span className="text-green-500 font-bold">● Mic On</span>
                  ) : (
                    <span className="text-red-500 font-bold">● Muted</span>
                  )}
                </span>

                {isRemoteHandRaised && (
                  <span className="absolute top-4 right-4 bg-amber-500 p-2.5 rounded-full shadow-lg border border-amber-400 animate-bounce">
                    <Hand className="w-5 h-5 text-white" />
                  </span>
                )}
              </div>

              {/* Local Webcam Video Tile (Your webcam feed) */}
              <div className="flex-grow w-full md:w-1/2 h-full bg-[#3c4043] rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-700 shadow-xl max-h-[80vh]">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover transform -scale-x-100 ${!isCameraOn ? 'hidden' : ''}`}
                />
                
                {!isCameraOn && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg border border-slate-800">
                      U
                    </div>
                    <p className="text-sm font-bold text-slate-400">Camera turned off</p>
                  </div>
                )}
                
                {/* Tile bottom left label */}
                <span className="absolute bottom-4 left-4 bg-black/60 px-4 py-1.5 rounded-xl text-xs font-bold border border-white/5 flex items-center gap-2">
                  You {isMicOn ? <span className="text-green-500 font-bold">● Mic On</span> : <span className="text-red-500 font-bold">● Muted</span>}
                </span>

                {isHandRaised && (
                  <span className="absolute top-4 right-4 bg-amber-500 p-2.5 rounded-full shadow-lg border border-amber-400 animate-bounce">
                    <Hand className="w-5 h-5 text-white" />
                  </span>
                )}
              </div>

            </div>

            {/* Right side: Google Meet Sidebar Chat panel */}
            {meetingChatOpen && (
              <div className="w-80 bg-white text-slate-900 rounded-3xl flex flex-col p-4 shadow-2xl border border-slate-800/20 flex-shrink-0 animate-slide-in">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 flex-shrink-0">
                  <h3 className="font-extrabold text-slate-800 text-md flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#b45309]" /> Call messages
                  </h3>
                  <button onClick={() => setMeetingChatOpen(false)} className="hover:bg-slate-100 p-1.5 rounded-xl">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-3 pr-1 min-h-0 text-sm">
                  {meetingChatMessages.map((cMsg, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cMsg.sender}</span>
                      <span className="bg-slate-50 p-2.5 rounded-2xl rounded-tl-none border border-slate-100 mt-1 text-slate-700 font-medium">
                        {cMsg.text}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMeetingChat} className="mt-4 border-t border-slate-100 pt-3 flex gap-2 flex-shrink-0">
                  <input 
                    type="text" 
                    value={meetingChatText}
                    onChange={(e) => setMeetingChatText(e.target.value)}
                    placeholder="Send a message to everyone..." 
                    className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#b45309]"
                  />
                  <button type="submit" className="bg-[#b45309] hover:bg-amber-800 text-white px-3 py-2 rounded-xl text-xs font-bold">
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Google Meet Bottom Controller panel */}
          <div className="bg-[#202124] border-t border-[#3c4043] px-8 py-5 flex items-center justify-between flex-shrink-0">
            {/* Left meeting tag details */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm select-all tracking-wider text-slate-300">
                meet.google.com/{liveMeetingId.substring(0,3)}-{liveMeetingId.substring(3,7)}-{liveMeetingId.substring(7)}
              </span>
              <span className="h-4 w-px bg-slate-700"></span>
              <span className="text-xs text-slate-400 font-bold">SHNOOR PRIVATE ROOM</span>
            </div>

            {/* Central control dials */}
            <div className="flex items-center gap-3.5">
              <button 
                onClick={toggleMic}
                className={`p-3.5 rounded-full border transition-all ${
                  isMicOn 
                    ? 'bg-[#3c4043] border-slate-600 hover:bg-[#4a4f54]' 
                    : 'bg-red-600 border-red-500 hover:bg-red-700 text-white'
                }`}
                title={isMicOn ? "Mute Mic" : "Unmute Mic"}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={toggleCamera}
                className={`p-3.5 rounded-full border transition-all ${
                  isCameraOn 
                    ? 'bg-[#3c4043] border-slate-600 hover:bg-[#4a4f54]' 
                    : 'bg-red-600 border-red-500 hover:bg-red-700 text-white'
                }`}
                title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={toggleScreenShare}
                className={`p-3.5 rounded-full border transition-all ${
                  isScreenSharing 
                    ? 'bg-[#b45309] border-[#b45309] hover:bg-amber-800 animate-pulse' 
                    : 'bg-[#3c4043] border-slate-600 hover:bg-[#4a4f54]'
                }`}
                title="Present Screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button 
                onClick={() => {
                  const nextVal = !isHandRaised;
                  setIsHandRaised(nextVal);
                  if (selectedPartner && socketRef.current) {
                    socketRef.current.emit('meeting_signal', {
                      to: selectedPartner.id,
                      type: 'hand',
                      payload: { raised: nextVal }
                    });
                  }
                }}
                className={`p-3.5 rounded-full border transition-all ${
                  isHandRaised 
                    ? 'bg-amber-500 border-amber-400 hover:bg-amber-600' 
                    : 'bg-[#3c4043] border-slate-600 hover:bg-[#4a4f54]'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setMeetingChatOpen(!meetingChatOpen)}
                className={`p-3.5 rounded-full border transition-all ${
                  meetingChatOpen 
                    ? 'bg-[#b45309] border-[#b45309] hover:bg-amber-800' 
                    : 'bg-[#3c4043] border-slate-600 hover:bg-[#4a4f54]'
                }`}
                title="Meeting Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <span className="h-6 w-px bg-slate-700 mx-2"></span>

              <button 
                onClick={leaveGoogleMeet}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 border border-red-500 rounded-full font-bold shadow-lg shadow-red-600/20 text-sm flex items-center gap-2 transition-all"
                title="Leave Meeting"
              >
                <PhoneOff className="w-5 h-5" /> Leave Call
              </button>
            </div>

            {/* Right spacer panel info */}
            <div className="flex items-center gap-2">
              <MoreVertical className="w-5 h-5 text-slate-400 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Popover Form */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-slate-800">
            <button 
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Schedule a Meeting</h2>
            <p className="text-sm text-slate-500 mb-6">Coordinate date, time, and topic details with your advisor.</p>

            <form onSubmit={handleScheduleMeetingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Meeting Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Monthly Performance Review"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Scheduled Date & Time</label>
                <input 
                  type="datetime-local"
                  required
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-grow bg-white border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-grow bg-[#b45309] text-white py-3 rounded-xl font-bold hover:bg-amber-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Confirm <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legacy Audio Calling Overlay */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-[200] p-4 text-white">
          <div className="w-full max-w-sm flex flex-col items-center">
            {callType === 'video' && activeCall === 'connected' ? (
              <div className="w-full aspect-[3/4] bg-slate-800 rounded-3xl mb-8 border border-slate-700 relative overflow-hidden flex items-center justify-center">
                <Video className="w-12 h-12 text-slate-500 animate-pulse" />
                <span className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-xs font-bold">
                  {selectedPartner?.company_name || 'Manager'} (Remote Camera)
                </span>
              </div>
            ) : (
              <div className="w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center mb-8 border-4 border-amber-500/30 animate-pulse">
                <User className="w-16 h-16 text-white" />
              </div>
            )}

            <h2 className="text-2xl font-black mb-1">{selectedPartner?.company_name || 'Manager'}</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">
              {activeCall === 'ringing' ? 'Ringing...' : `Call Active (${formatDuration(callDuration)})`}
            </p>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-colors ${
                  isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <button 
                onClick={endCall}
                className="p-5 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg shadow-red-600/30"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </button>

              <button 
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-4 rounded-full transition-colors ${
                  !isSpeakerOn ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {!isSpeakerOn ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserChat;
