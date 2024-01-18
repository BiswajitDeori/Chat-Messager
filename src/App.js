import './App.css';

import React, { useContext } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import {Container} from 'react-bootstrap'
import NavBar from './NavBar';
import { AuthContext } from './Context/AuthContext';
import { ChatContextProvider } from './Context/ChatContext';

function App() {

   
  const {user} = useContext(AuthContext)

  return (
    <>
    <BrowserRouter>
    <ChatContextProvider user={user}>
    <NavBar/>
    <Container className='text-secondary'>
    <Routes>
      <Route path='/'  element={user ? <Chat />: <Login/>}/>
      <Route path='/login' element = {user ? <Chat />:<Login/>}/>
      <Route path='/register' element = {user ? <Chat />:<Register/>} />
      <Route path='*'  element={<Navigate to="/"/>}/>
     </Routes>
    </Container>
    </ChatContextProvider>
     </BrowserRouter>
    </> 
  );
}

export default App;
