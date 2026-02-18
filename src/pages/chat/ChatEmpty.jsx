import React from 'react'
import { MessageCircle, Sparkles } from "lucide-react";
import styles from "../../styles/ChatEmpty.module.css";

const ChatEmpty = () => {
  return (
    <div className={styles.emptyContainer}>
        <div className={styles.iconWrapper}>
            <div className={styles.iconMain}>
                <MessageCircle size={60} />
            </div>
            <div className={styles.iconSparkle}><Sparkles size={20} /></div >
        </div>

        <h1>Welcome to Chatify</h1>
        <p>Select a conversation from the sidebar or start a new chat to connect with friends and groups.</p>

        <div className={styles.badges}>
            <span className={styles.badge}>
                <span className={styles.dot}/>
                    Real-time messaging
            </span>
            <span className={styles.badge}>
                <span className={styles.dot}/>
                    Group chats
            </span>
        </div>
    </div>
  )
}

export default ChatEmpty
