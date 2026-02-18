import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";
const AuthContext = createContext(null);
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                connectSocket(storedToken);
            } catch (err) {
                console.error("Invalid stored user:", err);
                localStorage.clear();
            }
        }

        setLoading(false);
    }, []);

    const login = (userData, jwt) => {
        setUser(userData);
        setToken(jwt);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", jwt);

        connectSocket(jwt);
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();

        disconnectSocket();
    }

    return (
        <AuthContext.Provider value={{user, token, loading, login, logout}}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext); 