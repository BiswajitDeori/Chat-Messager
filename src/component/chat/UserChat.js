import React, { useContext } from "react";
import { UseFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import icon2 from '../../icon/icon2.png'
import { ChatContext } from "../../Context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotification";
import moment from "moment";
import { Last } from "react-bootstrap/esm/PageItem";
 import {UseFetchLatestMessage} from "../../hooks/useFetchLatestMessage"
const UserChat = ({ chat, user}) => {
  const { recipientUser } = UseFetchRecipient(chat, user);
  const {onlineUsers,notification,markThisUserNotificationAsRead} = useContext(ChatContext)
  const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)
  const unreadNotification = unreadNotificationsFunc(notification)
  const {latestMessage} = UseFetchLatestMessage(chat)
  const thisUserNotifications  = unreadNotification?.filter((x) => x.senderId == recipientUser?._id)
  
  const truncateText =(text) =>
  {

    let shortText = text.substring(0,21);

    if(text.length>20)
    {
      shortText = shortText + '...';
    }

    return shortText;

  }
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card p-3 justify-content-between" role="button" onClick={()=>{
        if(thisUserNotifications?.length !==0 )
        {
          markThisUserNotificationAsRead(thisUserNotifications,notification);
        }
        }}>
      <div className="d-flex align-items-center">
        <div className="avatar me-3">
          <img src={icon2} alt="user image" width={"50px"} height={"50px"}/>
        </div>
        <div>
          <div className="name">
            <p>{recipientUser?.name}</p>
          </div>
          <div className="text">
            {
              latestMessage?.text && (<span>{truncateText(latestMessage?.text)}</span>)
            }
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
        {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div className="notifications">
          <span className={ isOnline?"user-online":""}></span>
          { thisUserNotifications.length >0 &&
            <span className="this-user-notifications">{thisUserNotifications.length}</span>
          }
          
        </div>
      </div>
    </Stack>
  );
};

export default UserChat;
