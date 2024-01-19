import { url, getRequest,postRequest } from "../utils/Services";
import { createContext, useCallback, useEffect, useState } from "react";
import {io} from 'socket.io-client'



export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChat] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat ,setCurrentChat] = useState(null);
  const [message, setMessages] = useState(null);
  const [isMessageLoading , setIsMessageLoading] = useState(false);
  const [messageError , setMessageError] = useState(null);
  const [sendTextMessageError,setSendTextMessageError] = useState(null);
  const [newMessage ,setNewMessage] =useState(null)
  const [socket,setSocket]=useState(null)
  const [onlineUsers,setOnlineUsers] = useState([])
  const [notification,setNotification] = useState([])
  const [allUser,setAllUser] = useState([])

  console.log("getting the notification",notification);
  useEffect(()=>
  {
    const newSocket = io("https://chat-socket-gx0c.onrender.com")
    setSocket(newSocket);

    console.log("connection to socket",newSocket);
    return () =>
    {
      newSocket.disconnect();
    }
  },[user])
   

  useEffect(() => {
    const getUser = async () => {
      const response = await getRequest(`${url}/users`);

      if (response.error) {
        return console.error("Error fetching the user", response);
      }

      

      const pChat = response.filter((x) => {
        let isChatCreated = false;
        if(x._id === user?._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some(
            (chat) =>
              chat.members[0] === x._id || chat.members[1] === x._id
          );
        }

        return !isChatCreated;
      });

      setPotentialChats(pChat);
      setAllUser(response)
    };
    getUser();
  }, [user, userChats]);


  


  useEffect(() => {
    const getUserCharts = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getRequest(`${url}/chats/${user._id}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChat(response);
      }
    };

    getUserCharts();
  }, [user , notification]);
   



  const createChat = useCallback(async (firstId, secondId) => {
    try {
      const response = await postRequest(`${url}/chats`, JSON.stringify({ firstId, secondId }));
  
      if (response.error) {
        console.error("Error while creating chat between two users", response);
        return;
      }
  
      setUserChat((prevChats) => [...prevChats, response]);
    } catch (error) {
      console.error("Error in createChat function", error);
    }
  }, []);
  

  const updateCurrentChat = useCallback(async(chat)=>
  {
    console.log('currentchat',chat);
    setCurrentChat(chat)
  })

  
  useEffect(() => {
    const getMessages = async () => {
        setIsMessageLoading(true);
        setMessageError(null);

        const response = await getRequest(`${url}/messages/${currentChat?._id}`);

        console.log("currentMessage",currentChat);
        setIsMessageLoading(false);
        if (response.error) {
          return setMessageError(response);
        }
        setMessages(response);
    };

    getMessages();
  }, [currentChat]);


  const sendTextMessage = useCallback(async(textMessage,sender,currentChatId,RestTheMessage)=>
  {

    if(!textMessage) return console.log("empty message");

  const response = await  postRequest(`${url}/messages`,JSON.stringify({
      chatId: currentChatId,
      senderId:sender._id,
      text:textMessage
    }))

    if (response.error) {
      console.error("Sending text error", response);
      return setMessageError(response);
     
    }

    setNewMessage(response)
    setMessages( (prev)=>[...prev,response])
    RestTheMessage()

  },[])

  // added live users
  useEffect(() => {
    if (socket === null) return console.log("socket is empty");
    socket.emit("addNewUser", user?._id);
    socket.on("onlineUsers",(x)=>
    {
      setOnlineUsers(x);
    })
    return ()=>
    {
      socket.off("onlineUsers")
    }

  }, [socket]);


  //send message to server

  useEffect(() => {
    if (socket === null) return console.log("socket is empty");
    
    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage",{...newMessage,recipientId})

  }, [newMessage]);


  // recived message and Notificaiton

  useEffect(() => {
    if (socket === null) return console.log("socket is empty");

    socket.on("getMessage",(res)=>
    {
      if(currentChat?._id != res.chatId) return;

      setMessages((prev)=> [...prev,res]);
    })

    socket.on("getNotification",(res)=>
    {
      const isChatOpen = currentChat?.members.some(id => id === res.senderId)

      console.log("geting the response",res);
      if(isChatOpen)
      {
        setNotification((prev)=>[{...res,isRead:true},...prev])
      }else
      {
        setNotification((prev)=>[res,...prev])
      }
      

    })

    return () =>
    {
      socket.off("getNotification")
      socket.off("getMessage")
    };

  }, [socket,currentChat]);
 

  //mark as read all

   const markAsReadAll =useCallback((notification)=>
   {
    const mNotification = notification.map((n)=>
    {
      return { ...n,isRead:true};
    })

    setNotification(mNotification);
   },[]);
  
   const markNotificationAsRead = useCallback((n,userChats,user,notification)=>
   {
    //marking the notificaiotn as read

    const mNotification = notification.map((el) =>{
      if(n.senderId == el.senderId)
      {
        
        return {...n,isRead:true}
      }else{
        return el;
      }
    })
   
    const desiredChat = userChats.find((chat) =>{
      const chatMembers = [user._id,n.senderId]
      const isDesiredChat = chat?.members.every((members)=>{
        return chatMembers.includes(members);
      });

      return isDesiredChat;
    });
    updateCurrentChat(desiredChat);
    setNotification(mNotification);

   },[message])
 

   const markThisUserNotificationAsRead = useCallback((thisUserNotifications,notificaiotn)=>
   {

    const mNotification = notificaiotn.map(el=>
      {

        let notificaiotn;

        thisUserNotifications.forEach(n=>
          {
            if(n.senderId === el.senderId)
            {
              notificaiotn = {...n,isRead:true}

            }else
            {
              notificaiotn = el;
            }
          })

          return notificaiotn;

      })

      setNotification(mNotification)

   },[currentChat])



  return (
    <ChatContext.Provider
      value={{ userChats,markNotificationAsRead,markThisUserNotificationAsRead, newMessage,isUserChatsLoading, userChatsError, potentialChats ,allUser,createChat,updateCurrentChat,message , isMessageLoading , messageError,currentChat ,sendTextMessage,onlineUsers,notification,markAsReadAll}}
    >
      {children}
    </ChatContext.Provider>
  );
};
