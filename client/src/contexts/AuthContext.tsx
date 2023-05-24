import React, { ReactNode, createContext, useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

interface User {
  email: string,
  _id: string
}

export interface AuthContextType {
  authState: AuthState;
  user: User | undefined;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [user, setUser] = useState<User | undefined>(undefined);

  //check if user is already logged in when component mounts
  useEffect(() => {
    getToken();
  }, []);


  const getToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
      console.log('Token found in local storage');
      setAuthState({ isAuthenticated: true, token });
    } else {
      console.log('No token found in local storage');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        localStorage.setItem('token', token);
        //FIXME should user be automatically logged in after registration? decide if setAuthState should be called here
      }

    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;

        localStorage.setItem('token', token);
        setAuthState({ isAuthenticated: true, token });
        setUser(user)
      } else {
        // Handle authentication error
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
