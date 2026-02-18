import React, { useEffect } from 'react'
import { Moon, Settings, LogOut } from "lucide-react";
import styles from './UserMenu.module.css'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
const UserMenu = () => {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handler = (e) => {
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handler);
        return() => document.removeEventListener('mousedown', handler);
    }, [])
    const {user, logout} = useAuth();
    if (!user) return null; // 👈 VERY important
  return (

    <div className={styles.userMenu} ref={menuRef}>
        <button className={`${styles.avatarBtn} ${open ? styles.active : ""}`} onClick={() => setOpen(!open)}>{user.name?.charAt(0) || "U"}</button>
        {open && (
        <div className={styles.menu}>
            <div className={styles.menuHeader}>
                <div className={styles.userInfo}>
                    <p className={styles.username}>{user.name || "User"}</p>
                    <span className={styles.status}>
                        <span className={styles.dot}/>Online
                    </span>
                </div>
            </div>

            <div className={`${styles.menuItem} ${styles.settings}`}>
                <Moon size={16} />
                Dark Mode
            </div>

            <div className={`${styles.menuItem} ${styles.settings}`}>
                <Settings size={16} />
                Settings
            </div>

            <div className={`${styles.menuItem} ${styles.danger}`} onClick={() => {
                logout();
                navigate("/auth")
            }}>
                <LogOut size={16} />
                Sign Out
            </div>
        </div>
        )}
    </div>
  )
}

export default UserMenu
