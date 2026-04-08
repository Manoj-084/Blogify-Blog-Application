import { createContext,useState } from "react";
import { token } from "../common/config";

 export const AuthContext = createContext();


 export const AuthProvider =({children}) => {
    const userInfo = token();
const [user,setUser] = useState(userInfo)

const login = (user) =>{
    setUser(user)   
}
const isLoggedIn = ()=>{
    return user ? true : false;
}

const logout =() => {
    localStorage.removeItem("mern-blog")
    setUser(null)
    }

    return(
        <AuthContext.Provider value = {{user,login,logout,isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}