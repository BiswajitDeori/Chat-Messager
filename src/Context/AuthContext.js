import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest } from "../utils/Services";

import { url } from "../utils/Services";

export const AuthContext = createContext()


export const AuthContextProvider = ({children}) =>
{

    const [user, setUser] = useState(null)
    const [registerError , setRegisterError] = useState(null);
    const [isRegisterLoading , setIsRegisterLodaing] = useState(false);

    const [loginError , setLoginError] = useState(null);
    const [isloginLoading , setIsLoginLodaing] = useState(false);

    const [registerInfo , setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    })
    
    const [loginInfo , setLoginInfo] = useState({
        email: "",
        password: "",
    })

     useEffect(()=>
     {
        setUser(JSON.parse(localStorage.getItem("User")))
     },[])

    const updateRegister = useCallback((info)=>
    {
        setRegisterInfo(info)

    },[])


    const updateLogin = useCallback((info)=>
    {
        setLoginInfo(info)

    },[])
   
   

    const logout = useCallback((e)=>
    {
        e.preventDefault();
        localStorage.removeItem("User");
        setUser(null);
    },[])


  
    const registerUser = useCallback(async(e)=>
    {
        e.preventDefault();
        setIsRegisterLodaing(true)
        setRegisterError(null)
        const response =   await postRequest(`${url}/users/register` , JSON.stringify(registerInfo))
       
        setIsRegisterLodaing(false);
        if(response.error)
        {
            return setRegisterError(response.message);
        }
         


        localStorage.setItem("User",JSON.stringify(response))
        setUser(response)
        },[registerInfo])

     
    const loginUser = useCallback(async(e)=>
    {
        e.preventDefault();
        setIsLoginLodaing(true)
        setLoginError(null)
        const response =   await postRequest(`${url}/users/login` , JSON.stringify(loginInfo))
       
        setIsLoginLodaing(false);
        if(response.error)
        {
            return setLoginError(response.message);
        }
        localStorage.setItem("User",JSON.stringify(response))
        setUser(response)
    },[loginInfo])    


        return (<AuthContext.Provider value={{user,registerInfo,updateRegister,registerUser,registerError,isRegisterLoading,logout,updateLogin,isloginLoading,loginError,loginInfo,loginUser}} >
        {children}
        </AuthContext.Provider>
    )
}

