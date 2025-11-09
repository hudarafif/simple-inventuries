import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("pos-user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem("pos-token");
        return storedToken ? storedToken : null;
    });

    const login = (useData, token) => {
        setUser(useData);
        localStorage.setItem("pos-user", JSON.stringify(useData));
        localStorage.setItem("pos-token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("pos-user");
        localStorage.removeItem("pos-token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext