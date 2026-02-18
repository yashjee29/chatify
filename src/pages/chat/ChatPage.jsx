import React, { useEffect, useMemo, useState } from 'react'
import styles from '../../styles/ChatPage.module.css'
import Sidebar from './Sidebar';
import ChatEmpty from './ChatEmpty';
import ChatWindow from './ChatWindow';
import NewChatModal from './NewChatModal';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../socket/socket';
import CreateGroupModal from './CreateGroupModal';
import api from '../../api/axios';
const ChatPage = () => {
  const {user} = useAuth();
  const socket = getSocket();

  const [chats, setChats] = React.useState([]);
  const [activeChatId, setActiveChatId] = React.useState(null);
  const [isNewChatOpen, setIsNewChatOpen] = React.useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  
  const isMobile = window.innerWidth <= 768;

  const activeChat = useMemo(() => chats.find(chat => chat.id === activeChatId), [chats, activeChatId]);

  /* ---------------- FETCH CHATS ---------------- */
  useEffect(() => {
  if(!user) return;
  const fetchChats = async () => {
    const res = await api.get("/chat", {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });
    setChats(res.data);
    setLoadingChats(false);
  }
  fetchChats();
  }, [user])

  /* ---------------- NEW CHAT SOCKET ---------------- */
  useEffect(() => {
    if(!socket) return;
    const handleNewChat = (formattedNewChat) => {
      setChats(prev => {
        if(prev.some(c => c.id === formattedNewChat.id)) return prev;
        return [formattedNewChat, ...prev];
      });
    }
    socket.on("chat:new", handleNewChat);
    return () => {
      socket.off("chat:new", handleNewChat);
    }
  }, [socket])

  /* ---------------- PRESENCE SOCKET (ONLINE/OFFLINE) ---------------- */
  useEffect(() => {
    if(!socket) return;
    const handleOnline = (userId) => {
      setChats(prev => prev.map(chat => {
        if(!chat.isGroup && chat.user?.id === userId){
          return {...chat, user: {...chat.user, online: true}};
        }

        if(chat.isGroup){
          return{
            ...chat, 
            participants: chat.participants.map(p => p.id === userId ? {...p, online: true} : p)
          }
        }
        return chat;
      }));
    }
    const handleOffline = (userId) => {
      setChats(prev => prev.map(chat => {
        if(!chat.isGroup && chat.user?.id === userId){
          return {...chat, user: {...chat.user, online: false}};
        }

        if(chat.isGroup){
          return{
            ...chat, 
            participants: chat.participants.map(p => p.id === userId ? {...p, online: false} : p)
          }
        }
        return chat;
      }));
    }
    socket.on("user:online", handleOnline);
    socket.on("user:offline", handleOffline);
    return () => {
      socket.off("user:online", handleOnline);
      socket.off("user:offline", handleOffline);
    }
  }, [socket])

  /* ---------------- MOBILE BACK HANDLING ---------------- */
  useEffect(() => {
    if(!isMobile) return;

    const handleBack = () => {
      if(!activeChat) return;
      setActiveChatId(null);
      window.history.replaceState({}, "");
    }

    if(activeChat){
      window.history.pushState({chatOpen: true}, "");
    }

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [activeChat, isMobile])


  if(!user) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleChatCreated = (chat) => {
    setChats(prev => {
      const exists = prev.some(c => c?.id === chat?.id);
      return exists ? prev : [chat, ...prev];
    });
    setActiveChatId(chat.id);
  }

  const handleSelectChat = (chat) => {
    setActiveChatId(prev => prev?.id === chat?.id ? null : chat?.id);
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className={styles.container}>

      {/* SIDEBAR */}
      {(!isMobile || !activeChat) && (
        <Sidebar
          onSelectChat={handleSelectChat}
          activeChat={activeChatId}
          onNewChat={() => setIsNewChatOpen(true)}
          onNewGroup={() => setShowGroupModal(true)}
          chat={chats}
          loading={loadingChats}
        />
      )}

      {/* CHAT AREA */}
      {(!isMobile || activeChat) && (
        <div className={styles.chatArea}>
          {activeChat ? (
            <ChatWindow
              chat={activeChat}
              onBack={() => setActiveChatId(null)}
            />
          ) : (
            <ChatEmpty />
          )}
        </div>
      )}

      {isNewChatOpen && (
        <NewChatModal
          onClose={() => setIsNewChatOpen(false)}
          onChatCreated={handleChatCreated}
        />
      )}

      {showGroupModal && (
        <CreateGroupModal
          onClose={() => setShowGroupModal(false)}
          onNext={(groupName) => {
            console.log("Group Name:", groupName);
            setShowGroupModal(false);
          }}
        />
      )}

    </div>
  );


}

export default ChatPage
