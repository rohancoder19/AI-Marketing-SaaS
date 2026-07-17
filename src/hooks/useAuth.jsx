import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'default-user',
    email: 'guest@aethera.ai',
    name: 'Guest Marketer'
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    return true;
  };

  const signup = async (fullName, email, password) => {
    return true;
  };

  const logout = () => {
    // Session is persistent in guest mode
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
