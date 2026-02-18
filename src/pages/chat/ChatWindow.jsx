import React, { useEffect } from 'react'
import { Send, Smile, ArrowLeft, Check, CheckCheck, Clock, Users } from "lucide-react";
import styles from '../../styles/ChatWindow.module.css';
import { getSocket } from '../../socket/socket';
import { useAuth } from '../../context/AuthContext';
import ChatSkeleton from '../../components/LoadingSkeleton/ChatSkeleton';
import api from '../../api/axios';
const ChatWindow = ({chat, onBack}) => {
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [text, setText] = React.useState('');
    const messageEndRef = React.useRef(null);
    const messageRefs = React.useRef({});
    const socket = getSocket();
    const {user} = useAuth();
    useEffect(() => {
        if(!chat?.id) return;

        const loadMessages = async () => {
            const {data} = await api.get(`/messages/${chat.id}`);
            setMessages(data);
            setLoading(false);
        }
        loadMessages();
    }, [chat?.id])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({
            behavior: messages.length > 1 ? "smooth" : "auto"
        });
    }, [messages])

    useEffect(() => {
        if(!chat?.id) return;

        socket.emit("chat:join", chat.id);

        return () => {
            socket.off("message:receive");
        }
    },[chat])

    useEffect(() => {
        const handleReceive = (data) => {
            if(!data) return;
            const {chatId, message} = data;
            if(!message || chatId !== chat.id) return;
            setMessages((prev) => {
                if(message.tempId){
                    const exists = prev.find(m => m.tempId === message.tempId);
                    if(exists){
                        console.log("Updating message with tempId:", message.tempId);
                        return prev.map(m => m.tempId === message.tempId ? {...m, ...message, status: 'sent'} : m);
                    }
                }
                return [...prev, message];
            })

            if(message.senderId !== user.id){
                socket.emit("message:delivered", {messageId: message.id, chatId});
            }
        }
        
        socket.on("message:receive", handleReceive);
        return () => {
            socket.off("message:receive", handleReceive);
        }
    },[chat?.id, user?.id])

    useEffect(() => {
        const handleDelivered = ({messageId, chatId}) => {
            if(chatId !== chat?.id) return;
            console.log("Message delivered:", messageId, chatId);
            setMessages((prev) => prev.map(m => m.id === messageId ? {...m, status: 'delivered'} : m));
        }

        socket.on("message:delivered", handleDelivered);
        return () => {
            socket.off("message:delivered", handleDelivered);
        }
    }, [])

    useEffect(() => {
        if(!chat?.id) return;

        const container = document.querySelector(`.${styles.messages}`);
        if(!container) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(!entry.isIntersecting) return;

                const messageId = entry.target.dataset.messageId;
                if(!messageId) return;
                const msg = messages.find(m => String(m.id) === messageId);
                if(!msg) return;
               
                if(msg.senderId === user.id) return;

                if(msg.status === 'read') return;

                socket.emit("message:read", {messageId: msg.id, chatId: chat.id});
            })
        }, {
            root: container,
            threshold: 0.6
        });

        messages.forEach(msg => {
            if(msg.id && msg.senderId !== user.id && msg.status !== 'read'){
                const el = messageRefs.current[msg.id];
                if(el){
                    observer.observe(el);
                }
            }
        })
        return () => {
            observer.disconnect();
        }
    }, [messages, chat?.id, user.id]);

    useEffect(() => {
        const handleRead = ({ messageId }) => {
            setMessages(prev =>
            prev.map(m =>
                m.id === messageId
                ? { ...m, status: "read" }
                : m
            )
            );
        };

        socket.on("message:read", handleRead);
        return () => socket.off("message:read", handleRead);
        }, []);

        const tempId =
            window.crypto?.randomUUID?.() ||
            Date.now().toString() + Math.random().toString(36).substring(2);
    const sendMessage = async () => {
        if(!text.trim()) return;
        const optimisticMessage = {
            tempId: tempId,
            chatId: chat.id,
            senderId: user.id,
            text: text,
            timestamp: new Date().toISOString(),
            status: 'sending'
        }
        setMessages((prev) => [...prev, optimisticMessage]);
        setText("");
        
        await api.post('/messages/', {
            chatId: chat.id,
            message: text,
            tempId: optimisticMessage.tempId
        }).then(res => {console.log(res)})
        
    }

    const getSenderName = (senderId) => {
        if(!chat?.participants) return "";

        const participant = chat.participants.find(p => p.id === senderId);
        return participant?.name || "Unknown User";
    }

    if (loading) {
        return <ChatSkeleton />;
    }
  return (
    <div className={styles.container}>
        <div className={styles.header}>
        <button
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Back"
        >
            <ArrowLeft size={22} />
        </button>

        <div className={styles.chatInfo}>
            <div className={styles.avatar}>
            {chat?.isGroup
                ? <Users size={18} />
                : chat?.user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className={styles.chatText}>
            <span className={styles.chatName}>
                {chat?.isGroup
                ? chat?.groupName
                : chat?.user?.name}
            </span>

            <span
                className={`${styles.chatStatus} ${
                chat?.isGroup
                    ? styles.offline
                    : chat?.user?.online
                    ? styles.online
                    : styles.offline
                }`}
            >
                {chat?.isGroup
                ? `${chat?.participants?.length} members`
                : chat?.user?.online
                    ? "Online"
                    : "Offline"}
            </span>
            </div>
        </div>
        </div>


        <div className={styles.messages}>
            {messages.length === 0 && (
                <div className={styles.empty}>
                    Start the conversation 👋
                </div>
            )}

            {messages.map((msg) => {
                const isMine = msg.senderId === user.id;
                const isGroup = chat?.isGroup;

                // const sender = chat?.participants?.find(p => p.id === msg.senderId);
                const senderName = getSenderName(msg.senderId) || "Unknown User";

                return (
                    <div
                        key={msg.id || msg.tempId}
                        className={`${styles.message} ${isMine ? styles.mine : styles.their}`}
                        ref={(el) => {
                            if (el && msg.id) {
                                messageRefs.current[msg.id] = el;
                            }
                        }}
                        data-message-id={msg.id}
                    >

                        {/* 🔥 SHOW NAME ONLY IN GROUP + NOT YOUR MESSAGE */}
                        {isGroup && !isMine && (
                            <div className={styles.senderName}>
                                {senderName}
                            </div>
                        )}

                        <span className={styles.text}>{msg.text}</span>

                        {isMine && (
                            <span className={`${styles.ticks} ${msg.status === 'read' ? styles.read : styles.unread}`}>
                                {msg.status === 'sending' && <Clock size={12} />}
                                {msg.status === 'sent' && <Check size={12} />}
                                {msg.status === 'delivered' && <CheckCheck size={12} />}
                                {msg.status === 'read' && <CheckCheck size={12} />}
                            </span>
                        )}
                    </div>
                );
            })}


            <div ref={messageEndRef}/>
        </div>
        <div className={styles.inputBar}>
            <button className={styles.iconBtn}>
                <Smile size={18} />
            </button>

            <input
                placeholder='Type a message...'
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button className={styles.sendBtn} onClick={sendMessage}>
                <Send size={18} />
            </button>
        </div>
    </div>
  )
}

export default ChatWindow
