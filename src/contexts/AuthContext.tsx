// context/AuthContext.tsx

import { createContext, useContext, useState, useEffect } from 'react';
import { ReactNode } from 'react';
import axios from 'axios';

interface User {
  email: string;
  token: string;
}

interface UserInfo {
  // Define the properties you expect from the /api/getUserInfo endpoint
}

interface Props {
  children: ReactNode;
}

interface AuthContextProps {
  user: User | null;
  userInfo: UserInfo | null;
  loginDetails: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    
  }, []);

  const loginDetails = (email: string, token: string) => {
    setUser({ email, token });
    fetchUserInfo(token);
  };

  const fetchUserInfo = async (token: string) => {

    try {
      const response = await axios.get<UserInfo>('/api/getUserInfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ user, userInfo, loginDetails, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
