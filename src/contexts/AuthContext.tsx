'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { ReactNode } from 'react';
import axios from 'axios';
import { apiTitles } from '../app/api/app';

interface User {
  email: string;
  token: string;
}

interface UserInfo {
  titre: string;
}

interface Props {
  children: ReactNode;
}

interface AuthContextProps {
  user: User | null;
  userInfo: UserInfo| null;
  userLoggedIn: Boolean | null;
  loginDetails: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userInfo: null,
  userLoggedIn: null,
  loginDetails: (email, token) => {
    console.log('logOut details');
  },
  logout: () => {
    console.log('Logging Out');
  },
});

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

  // useEffect(() => {
  //   if (user && user.email && user.token) {
  //     loginDetails(user.email, user.token);
  //   }
  // }, [user]);

  const loginDetails = (email: string, token: string) => {
    setUser({ email, token });
    setUserLoggedIn(true);
    // fetchUserInfo(token, email);
  };

  // const fetchUserInfo = async (token: string, email: string) => {
  //   try {
  //     const response = await axios.get(apiTitles + email, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         withCredentials: false,
  //       },
  //     });
  //     if (response.data.success === true) {
  //       setUserInfo(response.data);
  //     } else {
  //       console.error('Error getting user info', response.data.error);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user information:', error);
  //   }
  // };

  const logout = () => {
    setUser(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ user, userInfo, loginDetails, logout, userLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
