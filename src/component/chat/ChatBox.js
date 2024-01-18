import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';
import { UseFetchRecipient } from '../../hooks/useFetchRecipient';
import moment from 'moment'
import InputEmoji from "react-input-emoji"

import { Spinner, Stack } from 'react-bootstrap';

export const ChatBox = () => {
  const { user } = useContext(AuthContext);

  const { currentChat, message, isMessageLoading, sendTextMessage,onlineUsers } = useContext(ChatContext);
  const { recipientUser } = UseFetchRecipient(currentChat, user);

  // Fix: Use useState to create a state variable for textMessage
  const [textMessage, setTextMessage] = useState('');

  const scroll = useRef();
 
  const RestTheMessage =()=>
  {
    setTextMessage('')

  }
 
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  

  if (isMessageLoading) {
    return (
      <p style={{ textAlign: 'center', width: '100%' }}>
        Loading Conversation... <Spinner size='sm' />
      </p>
    );
  }

  if (!recipientUser) {
    return (
      <p style={{ textAlign: 'center', width: '' }}>
        No Conversion has Started Yet....
      </p>
    );
  }

  return (
    <Stack gap={4} className='chat-box' style={{maxWidth:"65%"}}>
      <div className='chat-header'>
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className='messages'>
        {message &&
          message.map((message, index) => (
            <Stack ref={scroll} key={index} className={`${message?.senderId === user?._id ? "message  align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
              <span style={{ fontFamily: "serif", fontSize: "18px" }}>{message.text}</span>
              <span className="message-timestamp" style={{ fontFamily: "serif", fontSize: "13px" }}>{moment(message.createdAt).calendar()}</span>
            </Stack>
          ))}
      </Stack>
      <Stack direction='horizontal' gap={4} className={`chat-input flex-grow-0 ${textMessage.length > 20 ? 'multiline-input' : ''}`}>
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage} 
          fontFamily='nunito'
        />
        <button className='send-btn' onClick={() => sendTextMessage(textMessage, user, currentChat._id, RestTheMessage)}><img width="28" height="28" src="https://img.icons8.com/fluency/48/filled-sent.png" alt="filled-sent" /></button>
      </Stack>
    </Stack>
  );
};
