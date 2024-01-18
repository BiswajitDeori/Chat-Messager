import React, { useContext, useState } from "react";

import icon3 from '../../icon/icon3.png'
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import moment from "moment";
const Notificaiton =()=>
{
    const [isOpen,setIsOpen] = useState(false)
    const {user} = useContext(AuthContext)
    const {allUser,notification,userChats,markAsReadAll,markNotificationAsRead} = useContext(ChatContext)

    const unreadNotifications = unreadNotificationsFunc(notification);
    const updateNotification = notification.map((x)=>
    {
        const sender = allUser.find( u => u._id == x.senderId)
           
        console.log("senderId",sender.name);
        return ({
            ...x,
            senderName: sender?.name
        })
    })

    


    return (
        <div className="notificaitons" onClick={()=>{setIsOpen(!isOpen)}}>
            <div className="notifications-icon">
                <img height={"60px"} width={"60px"}  src={icon3}/>
            </div>
            {unreadNotifications?.length  === 0 ? null : (
                <span className="notification-count">{unreadNotifications?.length}</span>
            )}
            {isOpen ? 
            (
                <div className="notifications-box">
                <div className="notifications-header">
                    <h3>Notificaitons</h3>
                    <div className="mark-as-read" onClick={()=>markAsReadAll(notification)}>Mark as Read</div>
                </div>
                {updateNotification?.length === 0 ?<span className="notification">No Notification yet....</span>:null}
                
                {updateNotification && updateNotification.map((n,index)=>
                {
                    return <div key={index} className={n.isRead ? 'notification': 'notification not-read'}
                     onClick={()=>{markNotificationAsRead(n,userChats,user,notification)}}>
                            <span> {`${n.senderName} send you new a message`}</span>
                            <span className="message-timestamp" style={{ fontFamily: "serif", fontSize: "13px",color:'white' }}>{moment(n.date).calendar()}</span>
                         </div>
                })}
            </div>
            ) : null}
        </div>
    )

}


export default Notificaiton;
