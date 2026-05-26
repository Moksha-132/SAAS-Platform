import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Bell, X } from 'lucide-react';

const GlobalNotificationListener = () => {
  const socketRef = useRef(null);
  const currentUserIdRef = useRef(null);

  const [permissionStatus, setPermissionStatus] = useState(() => {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket']
    });

    socketRef.current.on('settings_updated', (newSettings) => {
      localStorage.setItem('syncsaas_website_settings', JSON.stringify(newSettings));
      const root = document.documentElement;
      if (newSettings.bgColor) root.style.setProperty('--theme-bg', newSettings.bgColor);
      if (newSettings.textColor) root.style.setProperty('--theme-text', newSettings.textColor);
      if (newSettings.accentColor) root.style.setProperty('--theme-accent', newSettings.accentColor);
      if (newSettings.navBgColor) root.style.setProperty('--theme-nav-bg', newSettings.navBgColor);
      if (newSettings.navTextColor) root.style.setProperty('--theme-nav-text', newSettings.navTextColor);
      window.dispatchEvent(new Event('syncsaas_settings_updated'));
      window.dispatchEvent(new Event('storage'));
    });

    socketRef.current.on('notification', (data) => {
      try {
        const existingNotifs = JSON.parse(localStorage.getItem('syncsaas_notifications') || '[]');
        localStorage.setItem('syncsaas_notifications', JSON.stringify([data, ...existingNotifs]));
        const unreadCount = parseInt(localStorage.getItem('syncsaas_unread_count') || '0', 10) + 1;
        localStorage.setItem('syncsaas_unread_count', unreadCount.toString());
        window.dispatchEvent(new Event('syncsaas_new_notification'));
      } catch (e) {
        console.error(e);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        const title = data.type === 'meeting'
          ? 'New Meeting Scheduled'
          : `New Message from ${data.senderName || 'User'}`;
        new Notification(title, {
          body: data.message,
          icon: '/favicon.ico'
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const joinUserRoom = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || null;

      if (userId && userId !== currentUserIdRef.current && socketRef.current) {
        currentUserIdRef.current = userId;
        socketRef.current.emit('join_room', userId);
      } else if (!userId && currentUserIdRef.current) {
        currentUserIdRef.current = null;
      }
    };

    joinUserRoom();
    const intervalId = setInterval(joinUserRoom, 1500);
    return () => clearInterval(intervalId);
  }, []);

  const handleRequestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(status => {
        setPermissionStatus(status);
        if (status === 'granted') {
          new Notification('Notifications Enabled', {
            body: 'You will now receive desktop notifications for new messages.',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  if (permissionStatus !== 'default' || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 flex gap-3.5 items-start">
      <div className="p-2.5 bg-orange-50 text-[#f97316] rounded-xl shrink-0">
        <Bell className="w-5 h-5 animate-pulse" />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-slate-800 text-sm">Enable Desktop Notifications</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Stay updated instantly when managers or clients send you direct messages or meeting alerts.
        </p>
        <div className="flex gap-2.5 mt-3">
          <button
            onClick={handleRequestPermission}
            className="bg-[#f97316] hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Enable Now
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold px-3 py-2 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
      <button
        onClick={() => setShowPrompt(false)}
        className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default GlobalNotificationListener;
