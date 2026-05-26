import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const loadFromStorage = () => {
    try {
      const storedNotifs = JSON.parse(localStorage.getItem('syncsaas_notifications') || '[]');
      const storedCount = parseInt(localStorage.getItem('syncsaas_unread_count') || '0', 10);
      setNotifications(storedNotifs);
      setUnreadCount(storedCount);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFromStorage();

    const handleNewNotification = () => {
      loadFromStorage();
    };

    window.addEventListener('syncsaas_new_notification', handleNewNotification);
    return () => {
      window.removeEventListener('syncsaas_new_notification', handleNewNotification);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setUnreadCount(0);
      localStorage.setItem('syncsaas_unread_count', '0');
      window.dispatchEvent(new Event('syncsaas_new_notification'));
    }

    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification('Notifications Enabled', {
              body: 'You will now receive desktop notifications for new messages.',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  const handleNavigate = (type) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setShowDropdown(false);
    if (user.role === 'manager') {
      navigate('/manager-chat');
    } else if (user.role === 'admin') {
      navigate('/admin-chat');
    } else {
      navigate('/user-chat');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden transform opacity-100 scale-100 origin-top-right transition-all">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={() => {
                  localStorage.setItem('syncsaas_notifications', '[]');
                  localStorage.setItem('syncsaas_unread_count', '0');
                  window.dispatchEvent(new Event('syncsaas_new_notification'));
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <Bell className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-sm font-bold text-slate-400">No new alerts.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleNavigate(notif.type)}
                    className="p-4 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors items-start"
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${notif.type === 'meeting' ? 'bg-amber-50 text-[#b45309]' : 'bg-blue-50 text-blue-600'}`}>
                      {notif.type === 'meeting' ? <Calendar className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {notif.type === 'meeting' 
                          ? 'Meeting Update' 
                          : `Support Chat from ${notif.senderName || 'User'}`}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
