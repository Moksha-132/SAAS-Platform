import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantWidget = ({ role }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const adminSuggestions = [
    { label: 'Support Chat', query: 'Go to chat' },
    { label: 'Show Analytics', query: 'Show analytics page' },
    { label: 'How to approve managers?', query: 'How do I approve managers?' },
    { label: 'List of Companies', query: 'Go to companies' }
  ];

  const managerSuggestions = [
    { label: 'Contact Admin', query: 'Contact admin' },
    { label: 'Host New Software', query: 'How do I host new software?' },
    { label: 'Client Support Chat', query: 'Go to client chat' },
    { label: 'View Sales & Earnings', query: 'Go to sales' }
  ];

  const suggestions = role === 'admin' ? adminSuggestions : managerSuggestions;

  const [metrics, setMetrics] = useState({
    revenue: 0,
    companiesCount: 0,
    managersCount: 0,
    activeManagersCount: 0,
    pendingManagersCount: 0,
    salesCount: 0,
    softwareCount: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('syncsaas_token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        if (role === 'admin') {
          const res = await fetch('http://localhost:5000/api/admin/analytics', { headers });
          if (res.ok) {
            const data = await res.json();
            setMetrics({
              revenue: data.totalRevenue || 0,
              companiesCount: data.companiesCount || 0,
              activeManagersCount: data.activeManagersCount || 0,
              pendingManagersCount: data.pendingManagersCount || 0,
              managersCount: (data.activeManagersCount || 0) + (data.pendingManagersCount || 0),
              salesCount: 0,
              softwareCount: 0
            });
          }
        } else if (role === 'manager') {
          const dbRes = await fetch('http://localhost:5000/api/managers/dashboard', { headers });
          const swRes = await fetch('http://localhost:5000/api/managers/software', { headers });
          
          let totalRevenue = 0;
          let salesCount = 0;
          let softwareCount = 0;
          
          if (dbRes.ok) {
            const dbData = await dbRes.json();
            if (dbData.success) {
              totalRevenue = dbData.analytics?.totalRevenue || 0;
              salesCount = dbData.analytics?.salesCount || 0;
            }
          }
          if (swRes.ok) {
            const swData = await swRes.json();
            if (swData.success) {
              softwareCount = swData.software?.length || 0;
            }
          }
          
          setMetrics({
            revenue: totalRevenue,
            companiesCount: 0,
            managersCount: 0,
            activeManagersCount: 0,
            pendingManagersCount: 0,
            salesCount: salesCount,
            softwareCount: softwareCount
          });
        }
      } catch (err) {
        console.error('Failed to fetch AI assistant metrics:', err);
      }
    };
    
    fetchMetrics();
  }, [role]);

  useEffect(() => {
    const welcomeText = role === 'admin' 
      ? "Hello Admin! I am your SHNOOR Assistant. I can help you search companies, check manager approvals, view sales analytics, or navigate the dashboard. Try asking me a question or click a suggestion below!"
      : "Hello Manager! I am your SHNOOR Assistant. I can help you host new software, view sales, chat with clients, or update your settings. Try asking me a question or click a suggestion below!";

    setMessages([
      { id: 1, sender: 'bot', text: welcomeText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        action: botResponse.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 800);
  };

  const getBotResponse = (query) => {
    const q = query.toLowerCase().trim();

    // 1. Basic Greetings
    if (
      q === 'hi' || 
      q === 'hello' || 
      q === 'hey' || 
      q === 'yo' || 
      q === 'hola' || 
      q === 'greetings' || 
      q === 'good morning' || 
      q === 'good afternoon' || 
      q === 'good evening' ||
      q.startsWith('hello ') || 
      q.startsWith('hi ') || 
      q.startsWith('hey ')
    ) {
      return {
        text: role === 'admin'
          ? "Hello! 👋 I am your SHNOOR Assistant. As Administrator, you have full access to platform metrics, company registries, manager approvals, and global configurations. How can I help you today?"
          : "Hello! 👋 I am your SHNOOR Assistant. I'm here to help you host your software, manage client interactions, track sales, and navigate the manager portal. How can I assist you today?"
      };
    }

    // 2. Polite / How are you
    if (
      q.includes('how are you') || 
      q.includes("how's it going") || 
      q.includes('how do you do') || 
      q.includes('how are you doing') ||
      q.includes('hope you are well')
    ) {
      return {
        text: "I'm doing wonderfully, thank you! I'm fully charged and ready to assist you. How can I help you with the SHNOOR platform today? 😊"
      };
    }

    // 3. Identity / Who are you
    if (
      q.includes('who are you') || 
      q.includes('your name') || 
      q.includes('who is this') || 
      q.includes('what are you') || 
      q === 'bot' || 
      q.includes('introduce yourself')
    ) {
      return {
        text: "I am the **SHNOOR Bot**, your dedicated AI Assistant! 🚀\n\nI can help you retrieve real-time analytics, navigate between pages instantly, and guide you on how to execute key tasks on the platform (like managing subscriptions, approving users, or launching new products)."
      };
    }

    // 4. Polite / Thanks
    if (
      q === 'thanks' || 
      q === 'thank you' || 
      q === 'ty' || 
      q.includes('thank you so much') || 
      q === 'great' || 
      q === 'awesome' || 
      q === 'cool' || 
      q === 'perfect' ||
      q.includes('thank you!')
    ) {
      return {
        text: "You're very welcome! 😊 It is my absolute pleasure to help. Let me know if there's anything else you need!"
      };
    }

    // 5. Platform info / What is Shnoor / What is SyncSaaS
    if (
      q.includes('what is shnoor') || 
      q.includes('what is syncsaas') || 
      q.includes('what is this platform') || 
      q.includes('about shnoor') || 
      q.includes('what is this website') || 
      q.includes('about syncsaas') || 
      q.includes('what does this platform do')
    ) {
      return {
        text: "The **SHNOOR SAAS Platform** is a state-of-the-art multi-tenant ecosystem designed to streamline B2B software distribution and customer relations.\n\n• **For Managers**: You can easily list and host your software products, log offline sales, view visual financial metrics, and engage in real-time chat (with built-in document sharing and video meetings) to support your client companies.\n• **For Admins**: You maintain complete control over the system by reviewing and approving managers, tracking consolidated platform analytics, and modifying global contact details and system configurations."
      };
    }

    // 6. Capabilities / General Help
    if (
      q === 'help' || 
      q === 'what can you do' || 
      q.includes('what you can do') || 
      q.includes('features') || 
      q.includes('how to use') || 
      q.includes('capabilities') || 
      q.includes('commands') ||
      q.includes('options')
    ) {
      if (role === 'admin') {
        return {
          text: "As the **SHNOOR System Administrator Assistant**, here are some key things I can do for you:\n\n1. **Direct Navigation** 🧭\n   • *\"go to companies\"* or *\"show companies page\"*\n   • *\"go to managers\"* or *\"approve manager\"*\n   • *\"go to analytics\"* or *\"show analytics\"*\n   • *\"go to settings\"* or *\"show settings page\"*\n   • *\"go to chat\"* or *\"support chat\"*\n\n2. **Live System Metrics** 📊\n   • *\"how many managers\"* or *\"manager count\"*\n   • *\"how many companies\"* or *\"client count\"*\n   • *\"how much revenue\"* or *\"total earnings\"*\n\n3. **Quick Guidelines** 📖\n   • *\"how to approve manager\"* or *\"pending verification\"*\n\nTry typing one of these commands or asking a direct question!"
        };
      } else {
        return {
          text: "As your **SHNOOR Manager Portal Assistant**, here are some key things I can do for you:\n\n1. **Direct Navigation** 🧭\n   • *\"go to software\"* or *\"host software\"*\n   • *\"go to sales\"* or *\"view sales and earnings\"*\n   • *\"go to chat\"* or *\"client chat page\"*\n   • *\"go to settings\"* or *\"show settings page\"*\n   • *\"contact admin\"* or *\"chat with admin\"*\n\n2. **Live Manager Metrics** 📊\n   • *\"how much revenue\"* or *\"my earnings\"*\n   • *\"how many software products\"* or *\"software count\"*\n   • *\"client contacts count\"* or *\"my clients\"*\n\n3. **Quick Guidelines** 📖\n   • *\"how to host software\"* or *\"add a product\"*\n   • *\"how to log a sale\"* or *\"record sale\"*\n   • *\"how to schedule a video call\"* or *\"meeting\"\n\nTry typing one of these commands or asking a direct question!"
        };
      }
    }

    if (q.includes('go to companies') || q.includes('show companies') || q.includes('companies page') || q.includes('view companies')) {
      if (role === 'admin') {
        return {
          text: "Sure! Navigating you to the Companies list page where you can monitor registered tenants.",
          action: () => navigate('/admin-companies')
        };
      } else {
        return { text: "Access Denied: Only Administrator accounts can view the list of registered companies." };
      }
    }

    if (q.includes('go to managers') || q.includes('show managers') || q.includes('managers page') || q.includes('approve manager')) {
      if (role === 'admin') {
        return {
          text: "Understood. Navigating to the Managers page. Here you can check verified managers and update approval status.",
          action: () => navigate('/admin-managers')
        };
      } else {
        return { text: "Access Denied: Managers cannot approve other manager profiles. This is an admin-only feature." };
      }
    }

    if (q.includes('go to analytics') || q.includes('show analytics') || q.includes('analytics page')) {
      if (role === 'admin') {
        return {
          text: "Opening System Analytics dashboard. You will see aggregated platform metrics and registration history graphs.",
          action: () => navigate('/admin-analytics')
        };
      } else {
        return { text: "SaaS analytics for managers are located on your Sales page. Let me redirect you there.", action: () => navigate('/manager-sales') };
      }
    }

    if (q.includes('go to settings') || q.includes('show settings') || q.includes('settings page')) {
      const path = role === 'admin' ? '/admin-settings' : '/manager-settings';
      return {
        text: `Opening the settings configuration page. You can customize system settings or update your credentials.`,
        action: () => navigate(path)
      };
    }

    if (q.includes('go to dashboard') || q.includes('overview') || q.includes('home')) {
      const path = role === 'admin' ? '/admin-dashboard' : '/manager-dashboard';
      return {
        text: "Redirecting to your home dashboard overview screen.",
        action: () => navigate(path)
      };
    }

    if (q.includes('go to chat') || q.includes('chat page') || q.includes('support chat') || q.includes('client chat')) {
      const path = role === 'admin' ? '/admin-chat' : '/manager-chat';
      return {
        text: `Opening your Chat Portal. Here you can communicate directly with other roles, exchange documents, or start video meetings.`,
        action: () => navigate(path)
      };
    }

    if (q.includes('contact admin') || q.includes('message admin') || q.includes('chat with admin') || q.includes('talk to admin')) {
      if (role === 'manager') {
        return {
          text: "Certainly! I will redirect you to your Chat Portal and automatically select the System Administrator's contact.",
          action: () => navigate('/manager-chat?selectRole=admin')
        };
      } else {
        return {
          text: "You are the Admin account. If you need to contact managers, I can direct you to the Support Chat where they are listed.",
          action: () => navigate('/admin-chat')
        };
      }
    }

    if (q.includes('go to software') || q.includes('host software') || q.includes('hosted software') || q.includes('add software')) {
      if (role === 'manager') {
        return {
          text: "Navigating to your Hosted Software manager screen. Here you can host a new product or edit active software pricing.",
          action: () => navigate('/manager-software')
        };
      } else {
        return { text: "Software catalog is managed entirely by managers. Admins can view managers and general statistics." };
      }
    }

    if (q.includes('revenue') || q.includes('earning') || q.includes('total amount') || q.includes('made') || q.includes('profit')) {
      if (role === 'admin') {
        return {
          text: `The platform's current total revenue is $${metrics.revenue}. You can view the full details on the Analytics page.`,
          action: () => navigate('/admin-analytics')
        };
      } else {
        return {
          text: `Your current total software sales revenue is $${metrics.revenue} from ${metrics.salesCount} logged sales. You can view your detailed receipts on the Sales page.`,
          action: () => navigate('/manager-sales')
        };
      }
    }

    if (q.includes('manager count') || q.includes('how many managers') || q.includes('number of managers') || q.includes('managers count')) {
      if (role === 'admin') {
        return {
          text: `There are currently ${metrics.managersCount} managers registered on the platform (${metrics.activeManagersCount} active, ${metrics.pendingManagersCount} pending approval). You can manage them on the Managers list page.`,
          action: () => navigate('/admin-managers')
        };
      } else {
        return {
          text: "Only Administrators can manage and view platform-wide Manager statistics. You can view your personal hosted software products on the Hosted Software page.",
          action: () => navigate('/manager-software')
        };
      }
    }

    if (q.includes('company count') || q.includes('how many companies') || q.includes('number of companies') || q.includes('companies count') || q.includes('client count') || q.includes('how many clients') || q.includes('clients count')) {
      if (role === 'admin') {
        return {
          text: `There are currently ${metrics.companiesCount} client companies registered on the platform. You can view their details on the Companies page.`,
          action: () => navigate('/admin-companies')
        };
      } else {
        return {
          text: `You have active support chat partners in your queue. You can view and message your client contacts in the Client Chat workspace.`,
          action: () => navigate('/manager-chat')
        };
      }
    }

    if (q.includes('software count') || q.includes('how many software') || q.includes('number of software') || q.includes('products count') || q.includes('software products')) {
      if (role === 'manager') {
        return {
          text: `You currently have hosted ${metrics.softwareCount} software products in the catalog. You can add or edit products on the Hosted Software page.`,
          action: () => navigate('/manager-software')
        };
      } else {
        return {
          text: `Managers are responsible for hosting software products. You can view platform registration activity on your home Dashboard Overview.`,
          action: () => navigate('/admin-dashboard')
        };
      }
    }

    if (q.includes('meeting') || q.includes('schedule') || q.includes('video call') || q.includes('call')) {
      let path = role === 'admin' ? '/admin-chat' : '/manager-chat';
      if (role === 'manager' && q.includes('admin')) {
        path = '/manager-chat?selectRole=admin';
      }
      return {
        text: "To schedule a meeting or start a video call:\n1. Open your Chat Portal.\n2. Select the contact from the chat list.\n3. Click the Video Camera icon in the top-right corner of the chat.\n4. Select 'Immediate Call' or 'Schedule a Meeting' to initiate the call or invite.",
        action: () => navigate(path)
      };
    }

    if (q.includes('approve manager') || q.includes('verification') || q.includes('pending')) {
      if (role === 'admin') {
        return {
          text: "To approve a pending manager:\n1. Go to the Admin Dashboard Overview.\n2. Locate the 'Pending Verification' list.\n3. Click the 'Approve Manager' button to verify them. Alternatively, you can edit manager details from the 'Managers' sidebar section.",
          action: () => navigate('/admin-dashboard')
        };
      }
    }

    if (q.includes('how to host') || q.includes('host new software') || q.includes('add a product')) {
      if (role === 'manager') {
        return {
          text: "To host new software:\n1. Go to the 'Hosted Software' section in your sidebar.\n2. Click the '+ Host New Software' button.\n3. Fill in the product details, monthly/yearly pricing plans, and upload any project documents/zip archives.\n4. Click 'Host Product' to make it live in the Marketplace.",
          action: () => navigate('/manager-software')
        };
      }
    }

    if (q.includes('log a sale') || q.includes('log sale') || q.includes('record sale')) {
      if (role === 'manager') {
        return {
          text: "To log a new sale manually:\n1. Go to the 'Sales & Earnings' section in your sidebar.\n2. Click the '+ Log Offline Sale' button.\n3. Fill in the client's email, select the software, choose monthly/yearly plan type, and enter the amount paid.\n4. Click 'Submit' to activate the client subscription.",
          action: () => navigate('/manager-sales')
        };
      }
    }

    if (role === 'admin') {
      return {
        text: "I'm sorry, I didn't quite catch that. As Admin, I can direct you to: 'Companies', 'Managers', 'Analytics', or 'Settings'. Please let me know what you need help with."
      };
    } else {
      return {
        text: "I'm sorry, I didn't quite catch that. As Manager, I can redirect you to: 'Hosted Software', 'Client Chat', 'Sales & Earnings', or 'Settings'. Please let me know what you need help with."
      };
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-[#b45309] hover:bg-amber-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer group relative border border-amber-600"
            >
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
              
              <div className="absolute right-14 bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                AI Portal Assistant
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[520px] max-h-[80vh]"
            >
              <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm leading-none">SHNOOR Bot</h3>
                    <span className="text-[10px] text-amber-500 font-bold tracking-wider uppercase mt-1 inline-block">AI Assistant</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white bg-slate-800/50 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#0F172A] text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
                    }`}>
                      {msg.text}
                      
                      {msg.action && (
                        <button
                          onClick={() => {
                            msg.action();
                            setIsOpen(false);
                          }}
                          className="mt-3 w-full bg-amber-50 hover:bg-amber-100/80 text-[#b45309] font-bold py-2 px-3 rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1.5 text-xs"
                        >
                          Perform Action <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center gap-1 bg-white border border-slate-200 py-2.5 px-4 rounded-2xl rounded-tl-none w-20 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {messages.length === 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-[#b45309]" /> Suggested Queries
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {suggestions.map((s, index) => (
                      <button
                        key={index}
                        onClick={() => handleSend(s.query)}
                        className="text-[11px] bg-white border border-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg hover:border-[#b45309] hover:text-[#b45309] transition-all shadow-sm cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me a question..."
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#0F172A] text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AIAssistantWidget;
