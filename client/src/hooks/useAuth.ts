import { useContext } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext"; 



//CUSTOM HOOK TO ACCESS THE AUTH CONTEXT
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("You are trying to useAuth outside of the AuthProvider")
    }
    return context
}