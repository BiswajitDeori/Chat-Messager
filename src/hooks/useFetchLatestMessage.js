import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatContext";

import { url,getRequest } from "../utils/Services";



export const UseFetchLatestMessage =(chat)=>
{
    const {newMessage , notification} = useContext(ChatContext);

    const [latestMessage, setLatestMessage] = useState(null);
    useEffect(()=>
    {
        const getMessages = async ()=>
        {
            const response = await getRequest(`${url}/messages/${chat?._id}`);

            if(response.error)
            {
                return console.log("error getting messages....",response);
            }

            const lastMessage = response[response?.length - 1]; //getting the last messages

            setLatestMessage(lastMessage);
        }

        getMessages();

    },[newMessage,notification]);
    return {latestMessage};
}

