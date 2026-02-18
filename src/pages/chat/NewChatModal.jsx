import React from 'react'
import { X, Search } from "lucide-react";
import styles from '../../styles/NewChatModal.module.css';
import { useAuth } from '../../context/AuthContext';
import UserListSkeleton from '../../components/LoadingSkeleton/UserListSkeleton';
import api from '../../api/axios';
import { useEffect } from 'react';
const NewChatModal = ({ onClose, onChatCreated }) => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const { user } = useAuth();
    if (!user) return null;
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                console.log("Fetched users:", res.data);
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [user.token])

    const handleSelectUser = async (selectedUser) => {
        try {
            const res = await api.post("/chat", {
                targetUserId: selectedUser.id
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            onChatCreated(res.data);
            onClose();
        } catch (err) {
            console.error("Failed to create chat", err);
        }
    }
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>New Chat</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className={styles.iconWrap}>
                            <X />
                        </span>
                    </button>
                </div>

                <div className={styles.searchWrapper}>
                    <Search size={16} />
                    <input type="text" placeholder='Search users...' className={styles.searchInput} />
                </div>

                <div className={styles.userList}>
                    {loading ? (
                        <UserListSkeleton />
                    ) : users.length === 0 ? (
                        <div className={styles.empty}>No users available</div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className={styles.userRow}
                                onClick={() => handleSelectUser(user)}
                            >
                                <div className={styles.avatar}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.name}</span>
                                    <span className={`${styles.userStatus} ${user.online ? styles.online : styles.offline}`}>
                                        {user.online ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}

export default NewChatModal
