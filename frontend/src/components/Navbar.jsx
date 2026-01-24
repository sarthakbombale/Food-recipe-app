import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    // derive latest auth state directly from localStorage so UI updates immediately
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || 'null')
    const isLoggedIn = Boolean(token)

    const checkLogin = () => {
        if (isLoggedIn) {
            // remove only auth keys
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // close any open modal
            setIsOpen(false)
            // reload to ensure routed loaders reflect logged-out state
            window.location.href = '/'
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
                    <li onClick={() => !isLoggedIn && setIsOpen(true)}>
                        <NavLink to={isLoggedIn ? "/myRecipe" : "/"}>My Recipe</NavLink>
                    </li>
                    <li onClick={() => !isLoggedIn && setIsOpen(true)}>
                        <NavLink to={isLoggedIn ? "/favRecipe" : "/"}>Favourites</NavLink>
                    </li>
                    <li onClick={checkLogin}>
                        <p className="login" style={{ color: "black" }}>
                            {isLoggedIn ? "Logout" : "Login"}
                            {user?.name ? ` (${user.name})` : (user?.email ? ` (${user.email})` : "")}
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
