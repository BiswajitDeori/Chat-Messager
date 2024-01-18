

import { useContext,useEffect,useState } from "react"
import { ChatContext } from "../../Context/ChatContext"
import { AuthContext } from "../../Context/AuthContext"

const PotentialChats =()=>
{
    const {user} = useContext(AuthContext)
    const {potentialChats,createChat,onlineUsers} = useContext(ChatContext)
    
    return (<>
     <div className="all-users">
        {potentialChats && potentialChats.map((x,index)=>
        {
            return (<div className="single-user" key={index} onClick={ ()=>{createChat(user?._id , x._id)}}>
               {x.name}
               
                <span className={ onlineUsers?.some( u => u?.userId === x?._id)?"single-online":""}></span>
            </div>
            )
        })}
     </div>
    </>)

} 


export default PotentialChats