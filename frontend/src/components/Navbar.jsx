import React, { useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate() // Add this hook

    // Derive state
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || 'null')
    const isLoggedIn = Boolean(token)

    const checkLogin = () => {
        if (isLoggedIn) {
            // Logout Logic
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setIsOpen(false)
            
            // Instead of window.location.href, navigate smoothly
            navigate('/') 
            // Optional: If you need to force a re-render of components 
            // relying on localstorage, you might still need a refresh 
            // or a state management library (Redux/Context API).
            window.location.reload() 
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <header>
                <h2 style={{color:"black"}}>Food Blog</h2>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    
                    {/* Protected Link Logic */}
                    <li onClick={() => !isLoggedIn && setIsOpen(true)}>
                        <NavLink to={isLoggedIn ? "/myRecipe" : "/"}>My Recipe</NavLink>
                    </li>
                    
                    <li onClick={() => !isLoggedIn && setIsOpen(true)}>
                        <NavLink to={isLoggedIn ? "/favRecipe" : "/"}>Favourites</NavLink>
                    </li>
                    
                    <li onClick={checkLogin} style={{ cursor: 'pointer' }}>
                        <p className="login" style={{ color: "black", margin: 0 }}>
                            {isLoggedIn ? "Logout" : "Login"}
                            {user?.name && ` (${user.name})`}
                        </p>
                    </li>
                </ul>
            </header>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)} />
                </Modal>
            )}
        </>
    )
}