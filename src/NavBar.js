import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import './NavBar.css'

import { AuthContext } from "./Context/AuthContext";
import Notificaiton from "./component/chat/Notification";

const NavBar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
            <nav className="navbar">
                <div className="logo">CHAT ('_')</div>
                {user ? <span className="text-warning">Logged in as {user.name}</span> : ""}
                <ul className="nav-links">
                    { !user &&( <>
                    
                         <li><Link to="/login">Login</Link></li>
                         <li><Link to="/register">Register</Link></li>
                         </>
                    )
                    }
                   
                    {user && (                         
                        <li style={{display:"inline-flex",justifyContent:"space-between"}}>
                            <Notificaiton/>
                            <button onClick={logout} className="logout-button">
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </>
    );
}

export default NavBar;
