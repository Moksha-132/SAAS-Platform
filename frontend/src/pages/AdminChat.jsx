import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import NotificationBell from '../components/NotificationBell';
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { 
  Send, Paperclip, Smile, Phone, Video, Search, User, 
  ChevronRight, Download, File, X, PhoneCall, PhoneOff, 
  Mic, MicOff, Volume2, VolumeX, Calendar, Clock, ArrowRight,
  ExternalLink, VideoOff, Monitor, MessageSquare, Hand, MoreVertical
} from 'lucide-react';

const AdminChat = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeCall, setActiveCall] = useState(null); 
  const [callType, setCallType] = useState('audio'); 
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState('default');

  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [liveMeetingId, setLiveMeetingId] = useState(null); 
  
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [meetingChatOpen, setMeetingChatOpen] = useState(false);
  const [meetingChatText, setMeetingChatText] = useState('');
  const [meetingChatMessages, setMeetingChatMessages] = useState([
    { sender: 'System', text: 'Welcome to Google Meet! This call is private and secure.' }
  ]);

  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [isRemoteCameraOn, setIsRemoteCameraOn] = useState(true);
  const [isRemoteMicOn, setIsRemoteMicOn] = useState(true);
  const [isRemoteHandRaised, setIsRemoteHandRaised] = useState(false);

  const socketRef = useRef(null);
  const currentUserRef = useRef(JSON.parse(localStorage.getItem('user') || '{}'));
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
      for (const candidate of iceCandidatesQueueRef.current) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error(err);
        }
      }
      iceCandidatesQueueRef.current = [];
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => setNotificationStatus(perm));
      }
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    currentUserRef.current = user;
    
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket']
    });

    if (user.id) {
      socketRef.current.emit('join_room', user.id);
    }

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

      if (msg.sender_id !== user.id) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Message', {
            body: msg.message || 'Sent a file',
            icon: '/favicon.ico'
          });
        }
      }
    });

    socketRef.current.on('call_incoming', async (data) => {
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
        console.error(err);
      }
    });

    socketRef.current.on('call_accepted', async (data) => {
      if (peerRef.current) {
        try {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          await flushIceCandidates();
          setIsPeerConnected(true);
        } catch (err) {
          console.error(err);
        }
      }
    });

    socketRef.current.on('ice_candidate', async (data) => {
      if (peerRef.current && peerRef.current.remoteDescription) {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error(err);
        }
      } else {
        iceCandidatesQueueRef.current.push(data.candidate);
      }
    });

    socketRef.current.on('meeting_signal', (data) => {
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

  useEffect(() => {
    if (liveMeetingId) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    } else {
      leaveGoogleMeet();
    }
  }, [liveMeetingId]);

  const initWebRTC = async (isCaller) => {
    try {
      if (peerRef.current) return;

      if (!localStreamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error(err);
          return;
        }
      }

      peerRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerRef.current.addTrack(track, localStreamRef.current);
        });
      }

      peerRef.current.ontrack = (event) => {
        setIsPeerConnected(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerRef.current.onicecandidate = (event) => {
        if (event.candidate && selectedPartner) {
          socketRef.current.emit('ice_candidate', {
            to: selectedPartner.id,
            candidate: event.candidate
          });
        }
      };

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
      console.error(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/chats/partners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPartners(data.partners.filter(p => p.role === 'manager'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (partners.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const selectRole = params.get('selectRole');
      if (selectRole) {
        const partner = partners.find(p => p.role === selectRole);
        if (partner) {
          setSelectedPartner(partner);
        }
      }
    }
  }, [partners]);

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
    const senderName = user.company_name || user.email || 'Admin';

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
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        
        if (peerRef.current) {
          const senders = peerRef.current.getSenders();
          const videoSender = senders.find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            const screenTrack = screenStream.getVideoTracks()[0];
            await videoSender.replaceTrack(screenTrack);
          }
        }
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare(screenStream);
        };
      } else {
        stopScreenShare(screenStreamRef.current);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stopScreenShare = async (screenStream) => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    screenStreamRef.current = null;
    
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

  const handleInputFocus = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        setNotificationStatus(perm);
        if (perm === 'granted') {
          new Notification('Notifications Enabled', {
            body: 'You will now receive desktop notifications for new messages.',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  const filteredPartners = partners.filter(p =>
    p.role === 'manager' &&
    (p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      
      <div className="flex-grow ml-64 p-8 lg:p-12 bg-slate-50 h-screen flex flex-col">
        <div className="mb-6 flex-shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Chat</h1>
            <p className="text-slate-500 font-medium">Communicate directly with your platform managers.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </div>

        <div className="flex-grow bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/40 flex overflow-hidden min-h-0">
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            {notificationStatus === 'default' && (
              <div className="p-3 bg-amber-50 border-b border-slate-200 text-xs text-[#b45309] font-bold flex justify-between items-center">
                <span>Desktop notifications are disabled.</span>
                <button 
                  type="button" 
                  onClick={() => {
                    Notification.requestPermission().then(perm => {
                      setNotificationStatus(perm);
                      if (perm === 'granted') {
                        new Notification('Notifications Enabled', {
                          body: 'You will now receive desktop notifications for new messages.',
                          icon: '/favicon.ico'
                        });
                      }
                    });
                  }} 
                  className="bg-[#b45309] text-white px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                >
                  Enable
                </button>
              </div>
            )}
            {notificationStatus === 'denied' && (
              <div className="p-3 bg-red-50 border-b border-slate-200 text-xs text-red-600 font-bold">
                ⚠️ Alerts blocked. Allow notifications in browser settings.
              </div>
            )}
            <div className="p-4 border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..." 
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
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors relative cursor-pointer ${
                      selectedPartner?.id === p.id ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309] font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-slate-900 truncate">{p.email || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate capitalize">{p.role} {p.company_name ? `(${p.company_name})` : ''}</p>
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

          <div className="w-2/3 flex flex-col bg-slate-50/40 relative">
            {selectedPartner ? (
              <>
                <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309] font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{selectedPartner.email}</h3>
                      <p className="text-xs text-green-600 font-bold flex items-center gap-1 capitalize">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span> {selectedPartner.role} Connected
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setShowVideoDropdown(!showVideoDropdown)}
                      className={`p-2.5 rounded-xl transition-colors border cursor-pointer ${
                        showVideoDropdown 
                          ? 'bg-[#b45309] text-white border-[#b45309]' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100'
                      }`}
                      title="Video Meeting Options"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    {showVideoDropdown && (
                      <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl w-60 z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                        <button 
                          onClick={handleImmediateCall}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-slate-800 flex items-center gap-3 text-sm font-bold transition-colors cursor-pointer"
                        >
                          <Video className="w-4 h-4 text-green-600" />
                          Immediate Call
                        </button>
                        <button 
                          onClick={() => {
                            setShowScheduleModal(true);
                            setShowVideoDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 text-slate-800 flex items-center gap-3 text-sm font-bold transition-colors border-t border-slate-100 cursor-pointer"
                        >
                          <Calendar className="w-4 h-4 text-amber-600" />
                          Schedule a Meeting
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => {
                    const isSelf = msg.sender_id === currentUserRef.current.id;
                    const isImmediateCall = msg.message.startsWith('🎥 JOIN IMMEDIATE VIDEO CALL');
                    const isScheduledMeeting = msg.message.startsWith('📅 MEETING SCHEDULED:');

                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        {isImmediateCall ? (
                          <div className="p-5 rounded-3xl shadow-md border max-w-[80%] flex flex-col gap-4 bg-white border-green-200/80">
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
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
                            >
                              <PhoneCall className="w-4 h-4 animate-bounce" /> Join Video Call
                            </button>
                          </div>
                        ) : isScheduledMeeting ? (
                          <div className="p-5 rounded-3xl shadow-md border max-w-[80%] flex flex-col gap-4 bg-white border-amber-200">
                            <div className="flex items-start gap-4">
                              <div className="p-3.5 bg-amber-50 text-[#b45309] rounded-2xl">
                                <Calendar className="w-6 h-6" />
                              </div>
                              <div className="min-w-0 flex-grow">
                                <h4 className="font-extrabold text-slate-900 text-sm truncate">{msg.message.split('|')[0].replace('📅 MEETING SCHEDULED:', '').trim()}</h4>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {msg.message.split('|')[1]?.trim()}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setLiveMeetingId(msg.message.split('|')[2].trim())}
                              className="w-full bg-[#b45309] hover:bg-amber-800 text-white py-2.5 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" /> Open Meeting Room
                            </button>
                          </div>
                        ) : (
                          <div className={`p-4 rounded-2xl max-w-[70%] text-sm relative group ${
                            isSelf 
                              ? 'bg-[#0f172a] text-white rounded-tr-none shadow-md shadow-slate-900/10' 
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                          }`}>
                            {msg.file_url ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl text-slate-800">
                                  <File className="w-6 h-6 text-slate-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-grow">
                                    <p className="text-xs font-bold truncate">{msg.file_name || 'Document'}</p>
                                  </div>
                                  <a 
                                    href={`http://localhost:5000${msg.file_url}`} 
                                    download 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-1 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                                {msg.message && <p>{msg.message}</p>}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                            )}
                            <span className="text-[10px] block mt-1 text-right text-slate-400">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="bg-white border-t border-slate-100 p-4 flex-shrink-0 relative">
                  {showEmojiPicker && (
                    <div className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-2xl border border-slate-100 overflow-hidden">
                      <EmojiPicker 
                        onEmojiClick={(emojiData) => setNewMessage(prev => prev + emojiData.emoji)}
                        searchDisabled
                        skinTonesDisabled
                        width={300}
                        height={350}
                      />
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${showEmojiPicker ? 'bg-amber-50 text-[#b45309] border-amber-100' : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-100'}`}
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100 transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />

                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onFocus={handleInputFocus}
                      placeholder="Type a message..." 
                      className="flex-grow py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm" 
                    />
                    
                    <button 
                      type="submit" 
                      className="p-3 bg-[#b45309] hover:bg-amber-800 text-white rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-16 h-16 text-slate-200 mb-4 stroke-1 animate-pulse" />
                <h3 className="font-extrabold text-slate-900 text-lg">Support Chat Portal</h3>
                <p className="max-w-md text-sm text-slate-400 mt-2 leading-relaxed">
                  Select a partner from the sidebar list to begin a conversation. You can send text, files, and schedule WebRTC video calls.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {liveMeetingId && (
        <div className="fixed inset-0 bg-[#0F172A] z-[99999] flex flex-col">
          <div className="px-6 py-4 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20">
                <Video className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm leading-none">Google Meet Live Room</h2>
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider mt-1.5 inline-block">Secure WebRTC Session</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-800 py-1.5 px-3 rounded-lg border border-slate-700 font-bold text-slate-300">
                Room ID: {liveMeetingId}
              </span>
            </div>
          </div>

          <div className="flex-grow relative flex bg-[#0B0F19] p-6 gap-6 min-h-0">
            <div className="flex-grow rounded-3xl overflow-hidden bg-[#1E293B] relative border border-slate-800 flex items-center justify-center shadow-inner">
              {!isPeerConnected ? (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-600 border-t-amber-500 animate-spin mb-4" />
                  <p className="font-bold">Waiting for participant to join...</p>
                  <p className="text-xs text-slate-500 mt-1">Make sure they click the Join button in their chat window.</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover transform scale-x-[-1] ${!isRemoteCameraOn ? 'hidden' : ''}`} 
                  />
                  {!isRemoteCameraOn && (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 border border-slate-700 mb-3">
                        <User className="w-12 h-12" />
                      </div>
                      <p className="font-bold text-sm">Participant turned camera off</p>
                    </div>
                  )}
                  {!isRemoteMicOn && (
                    <span className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-xl flex items-center gap-1.5 text-xs font-black shadow-md border border-red-500 animate-pulse">
                      <MicOff className="w-3.5 h-3.5" /> Muted
                    </span>
                  )}
                  {isRemoteHandRaised && (
                    <span className="absolute bottom-4 left-4 bg-amber-500 text-slate-900 p-2.5 rounded-xl flex items-center gap-1.5 text-xs font-black shadow-md border border-amber-400 animate-bounce">
                      <Hand className="w-4 h-4 fill-slate-900" /> Raised Hand
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="w-80 rounded-3xl overflow-hidden bg-[#1E293B] border border-slate-800 shadow-2xl relative flex-shrink-0 flex items-center justify-center">
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transform scale-x-[-1] ${!isCameraOn ? 'hidden' : ''}`} 
              />
              {!isCameraOn && (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 border border-slate-700 mb-2">
                    <User className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-xs">Your camera is off</p>
                </div>
              )}
              <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-bold border border-white/10">
                You (Presenter)
              </span>
            </div>

            {meetingChatOpen && (
              <div className="w-80 bg-[#1E293B] rounded-3xl border border-slate-800 flex flex-col shadow-2xl flex-shrink-0 min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center text-white">
                  <h3 className="font-bold text-xs uppercase tracking-wider">In-call Messages</h3>
                  <button 
                    onClick={() => setMeetingChatOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-3 min-h-0">
                  {meetingChatMessages.map((chat, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold">{chat.sender}</span>
                      <p className="text-xs bg-slate-800 text-slate-200 p-2 rounded-xl mt-1 leading-relaxed border border-slate-700/60 inline-block self-start max-w-full">
                        {chat.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMeetingChat} className="p-3 border-t border-slate-800 bg-slate-900 flex gap-2">
                  <input 
                    type="text" 
                    value={meetingChatText}
                    onChange={(e) => setMeetingChatText(e.target.value)}
                    placeholder="Send message to everyone" 
                    className="flex-grow py-2 px-3 bg-slate-800 text-white rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button type="submit" className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl transition-colors cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="bg-[#1E293B] py-6 border-t border-slate-800 flex items-center justify-between px-8 text-white z-50">
            <div>
              <p className="text-slate-400 text-xs font-semibold">Active Call</p>
              <h4 className="font-bold text-sm tracking-wider text-green-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-ping"></span> Live Broadcast
              </h4>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMic}
                className={`p-3.5 rounded-full transition-all border cursor-pointer ${
                  isMicOn 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                    : 'bg-red-600 hover:bg-red-700 text-white border-red-500'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={toggleCamera}
                className={`p-3.5 rounded-full transition-all border cursor-pointer ${
                  isCameraOn 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                    : 'bg-red-600 hover:bg-red-700 text-white border-red-500'
                }`}
                title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={toggleScreenShare}
                className={`p-3.5 rounded-full transition-all border cursor-pointer ${
                  isScreenSharing 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                title={isScreenSharing ? 'Stop Presenting Screen' : 'Present Your Screen'}
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button 
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem('user') || '{}');
                  const raised = !isHandRaised;
                  setIsHandRaised(raised);
                  if (selectedPartner && socketRef.current) {
                    socketRef.current.emit('meeting_signal', {
                      to: selectedPartner.id,
                      type: 'hand',
                      payload: { raised, sender: user.email }
                    });
                  }
                }}
                className={`p-3.5 rounded-full transition-all border cursor-pointer ${
                  isHandRaised 
                    ? 'bg-amber-500 text-slate-900 border-amber-400' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setMeetingChatOpen(!meetingChatOpen)}
                className={`p-3.5 rounded-full transition-all border cursor-pointer ${
                  meetingChatOpen 
                    ? 'bg-amber-500 text-slate-900 border-amber-400' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                title="Call Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              <button 
                onClick={leaveGoogleMeet}
                className="bg-red-600 hover:bg-red-700 text-white p-3.5 px-6 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 border border-red-500 cursor-pointer"
              >
                <PhoneOff className="w-5 h-5" /> Leave Meeting
              </button>
            </div>

            <div>
              <p className="text-slate-400 text-xs text-right">Privacy Status</p>
              <p className="text-slate-300 font-bold text-xs mt-0.5">Encrypted Connection</p>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform opacity-100 scale-100 transition-all">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Schedule Video Meeting</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleScheduleMeetingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Meeting Title</label>
                <input 
                  type="text" 
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g., Q3 Software Demonstration" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Scheduled Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm" 
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#b45309] hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Book and Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
