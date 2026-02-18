import React, { use, useEffect } from 'react'
import styles from '../../styles/Sidebar.module.css'
import { MessageCircle, Users, Pencil, Search } from "lucide-react";
import UserMenu from '../../components/UserMenu/UserMenu';
import SidebarSkeleton from '../../components/LoadingSkeleton/SidebarSkeleton';

const Sidebar = ({onSelectChat, onNewChat, onNewGroup, chat, activeChat, loading}) => {
    const [chats, setChats] = React.useState([]);
    useEffect(() => {
        if(Array.isArray(chat) && chat.length > 0){
            setChats(chat);
        }
    }, [chat])
    if (loading) {
        return (
            <div className={styles.sidebar}>
            <SidebarSkeleton />
            </div>
        );
    }
    console.log(chats)
  return (
    <div className={styles.sidebar}>
        <div className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.logoBadge}>
                    <MessageCircle size={18} />
                </div>
                <span className={styles.brandText}>Chatify</span>
            </div>
            <div className={styles.userMenuWrapper}>
                <UserMenu />
            </div>
        </div>
        <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon}/>
            <input className={styles.search} type="text" name="" id="" placeholder='Search conversations...' />
        </div>

        <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={onNewChat}>
                <Pencil size={18}/> New Chat
            </button>
            <button className={styles.actionBtn} onClick={onNewGroup}>
                <Users size={18}/> New Group
            </button>
        </div>
        {chats.length === 0 ? (
        <div className={styles.emptyList}>
            <MessageCircle size={32} />
            <p>No conversations yet</p>
            <span>Start a new chat to begin messaging</span>
        </div>
        ) : (
            <div className={styles.chatList}>
                {chats.map(chat => {
                    const isActive = activeChat && activeChat.id === chat.id;
                    const isGroup = chat?.isGroup;
                    const displayName = isGroup ? chat.groupName : chat?.user?.name || "Unknown User";
                    const displayOnline = !isGroup && chat?.user?.online;
                    const avatarText = isGroup ? <Users size={18} /> : displayName.charAt(0).toUpperCase();
                    return (
                        <div 
                            key={chat?.id}
                            className={`${styles.chatItem} ${isActive ? styles.activeChatItem : ''}`}
                            onClick={() => onSelectChat(chat)}
                        >
                            <div className={styles.userRow}>
                                <div className={styles.avatar}>
                                    {avatarText}
                                    {displayOnline && <span className={styles.onlineDot}></span>}
                                </div>
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{displayName}</span>
                                <span className={`${styles.userStatus} ${displayOnline ? styles.online : styles.offline}`}>{displayOnline ? "Online" : "Offline"}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  )
}

export default Sidebar
