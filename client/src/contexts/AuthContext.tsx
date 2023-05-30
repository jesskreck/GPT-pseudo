import { ReactNode, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


///////"SUB"INTERFACES 
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

interface User {
  _id: string,
  email: string,
}

///////MAIN INTERFACE FOR CONTEXT
interface AuthContextType {
  tokenChecked: boolean;
  authState: AuthState | null;
  user: User | null;
  register(email: string, password: string): void;
  login(email: string, password: string): void;
  logout: () => void;
}


///////VARIABLES
const initialAuthContext: AuthContextType = {
  tokenChecked: false,
  authState: null,
  user: null,
  register: () => { console.log("register() called outside of AuthContext"); },
  login: () => { console.log("login() called outside of AuthContext"); },
  logout: () => { console.log("logout() called outside of AuthContext"); }
}


const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
};


//STEP 1: creating the context
//STEP 1b: creating ContextType + initialContext variable
export const AuthContext = createContext<AuthContextType>(initialAuthContext);
//NOTE: export const AuthContext = createContext<AuthContextType | undefined>(undefined) brings the following error messagen when trying to deconstruct login function with useContext hook: "Property 'login' does not exist on type 'AuthContextType | undefined'.ts(2339)"




//STEP 2: creating the provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {

  //STEP 3: creating states and functions that should be saved in context
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const [tokenChecked, setTokenChecked] = useState(false);

  //check if user is already logged in when component mounts
  useEffect(() => {
    checkForLocalToken();
  }, []);

 
  const checkForLocalToken = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token found in local storage");
      await fetchUserWithToken(token);
    } else {
      console.log("No token found in local storage");
      setAuthState(initialAuthState);
      setUser(null);
    }
    setTokenChecked(true);
  };

  const fetchUserWithToken = async (token: string) => {
    const tokenForFetch = token;
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_API_URL}/auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const result = await response.json();
        setUser({ _id: result._id, email: result.email });
        setAuthState({ isAuthenticated: true, token: tokenForFetch });
      }
    } catch (error) {
      console.log(error);
    }
  }


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
        const { user } = data;

        // localStorage.setItem('token', token);
        // setAuthState({ isAuthenticated: true, token });
        // setUser(user);
        console.log('%cUser registered :>> ', "color: blue", user);
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    //NOTE sending the body as URLencoded instead of JSON would be faster (not more secure though)
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
        console.log('%cFirst user fetch after login :>> ', "color: blue", user);
        navigate("/chat");
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
    setUser(null);
    navigate("/login")
  };

  return (
    //STEP 4: return the context provider and add needed states/functions in value
    <AuthContext.Provider value={{ tokenChecked, authState, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};