import React, { useState, useEffect } from "react";
import { X, Users, Search, Check } from "lucide-react";
import styles from "../../styles/CreateGroupModal.module.css";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
const CreateGroupModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
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
            const filtered = res.data.filter(u => u.id !== user.id);
            setUsers(filtered);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    }
    fetchUsers();
    }, [user.token])


    const handleCreateGroup = async () => {
        const res = await api.post("/chat/group", {
        groupName,
        members: selectedUsers.map(u => u.id),
        });

        onClose();
    }
    
    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            
            {/* Header */}
            <div className={styles.header}>
            <h3 className={styles.title}>
                {step === 1 ? "Create Group" : "Add Members"}
            </h3>
            <button onClick={onClose} className={styles.closeBtn}>
                <X size={18} />
            </button>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
            <>
                <div className={styles.iconWrapper}>
                <Users size={32} />
                </div>

                <label className={styles.label}>Group Name</label>
                <input
                type="text"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={styles.input}
                />

                <div className={styles.actions}>
                <button onClick={onClose} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button
                    onClick={() => setStep(2)}
                    disabled={!groupName.trim()}
                    className={styles.nextBtn}
                >
                    Next
                </button>
                </div>
            </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
            <>
                <div className={styles.searchWrapper}>
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Search users..."
                    className={styles.searchInput}
                />
                </div>

                <div className={styles.userList}>
                    {users.map((u) => {
                        const isSelected = selectedUsers.some(user => user.id === u.id);

                        return (
                        <div
                            key={u.id}
                            className={`${styles.userRow} ${isSelected ? styles.selected : ""}`}
                            onClick={() => {
                            if (isSelected) {
                                setSelectedUsers(prev => prev.filter(user => user.id !== u.id));
                            } else {
                                setSelectedUsers(prev => [...prev, u]);
                            }
                            }}
                        >
                            <div className={styles.userLeft}>
                            <div className={styles.avatar}>
                                {u.name?.charAt(0).toUpperCase()}
                            </div>

                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{u.name}</span>
                                <span className={`${styles.userStatus} ${u.online ? styles.online : styles.offline}`}>
                                {u.online ? "Online" : "Offline"}
                                </span>
                            </div>
                            </div>

                            <div className={`${styles.checkbox} ${isSelected ? styles.checked : ""}`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                            </div>
                        </div>
                        );
                    })}
                    </div>



                <div className={styles.actions}>
                <button
                    onClick={() => setStep(1)}
                    className={styles.cancelBtn}
                >
                    Back
                </button>
                <button
                    disabled={selectedUsers.length === 0}
                    className={styles.createBtn}
                    onClick={handleCreateGroup}
                >
                    Create Group ({selectedUsers.length})
                </button>
                </div>
            </>
            )}

        </div>
        </div>
    );
};

export default CreateGroupModal;
