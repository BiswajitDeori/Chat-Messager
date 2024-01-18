
import React from 'react'

import { useContext } from 'react'

import { ChatContext } from '../Context/ChatContext'
import { Container, Stack } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { AuthContext } from '../Context/AuthContext';
import UserChat from '../component/chat/UserChat';
import PotentialChats from '../component/chat/PotentialChats';
import { ChatBox } from '../component/chat/ChatBox';
const Chat =()=>
{
    
    const {userChats,isUserChatsLoadaing,userChatsError,updateCurrentChat,onlineUsers} = useContext(ChatContext);
    const {user} = useContext(AuthContext)
    return (
    <Container>
        <PotentialChats/>
        {  userChats?.length <1 ?null:
           (
            <Stack direction='horizontal' gap={5} className='align-items-start'>
            <Stack className='message-box flex-grow-0' gap={4}>
                {isUserChatsLoadaing && <p>Loading chat... <Spinner size='sm'/></p>}
               {userChats?.map((chat,index)=>
               {
                return (
                    <div key={index} onClick={()=> updateCurrentChat(chat)}>
                        <UserChat  chat={chat} user={user} />
                    </div>
                );
               })}
            </Stack>
            <ChatBox/>
            </Stack>
           )
        }
    </Container>
     )
}


export default Chat
