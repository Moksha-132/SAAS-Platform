import React from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import { MessageSquare } from 'lucide-react';

const ManagerChat = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow ml-64 p-8 h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Client Chat</h1>
          <p className="text-slate-500">Communicate, schedule meetings, and close deals directly.</p>
        </div>
        
        <div className="flex-grow bg-white border border-slate-200 rounded-2xl shadow-sm flex overflow-hidden min-h-0">
          {/* Chat List */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100">
               <input type="text" placeholder="Search clients..." className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-[#f97316] text-sm" />
            </div>
            <div className="overflow-y-auto flex-grow flex items-center justify-center">
               <p className="text-sm text-slate-500">No active chats.</p>
            </div>
          </div>
          
          {/* Active Chat */}
          <div className="w-2/3 flex flex-col items-center justify-center bg-slate-50">
             <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
             <h3 className="text-lg font-bold text-slate-900">No Chat Selected</h3>
             <p className="text-sm text-slate-500">Select a conversation from the sidebar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerChat;
