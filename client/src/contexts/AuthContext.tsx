import React, { ReactNode, createContext, useState, useEffect } from 'react';

///////MAIN INTERFACE FOR CONTEXT
interface AuthContextType {
  authState: AuthState;
  user: User | undefined;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

///////"SUB"INTERFACES 
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

interface User {
  email: string,
  _id: string
}

///////VARIABLES
const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
};


//STEP 1: creating the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


//STEP 2: creating the provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  //STEP 3: creating states and functions that should be saved in context
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
    //STEP 4: return the context provider and add needed states/functions in value
    <AuthContext.Provider value={{ authState, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};