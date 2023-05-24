import React, { ReactNode, createContext, useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export interface AuthContextType {
  authState: AuthState;
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
        const { token } = data;

        localStorage.setItem('token', token);
        setAuthState({ isAuthenticated: true, token });
      } else {
        // Handle authentication error
      }
    } catch (error) {
      // Handle general error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
