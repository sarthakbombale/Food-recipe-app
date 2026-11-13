import React, { useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const isLoggedIn = Boolean(token)

    const checkLogin = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setIsOpen(false)
            navigate('/')
            window.location.reload()
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <header>
                <div className="brand">
                    <div className="brand-mark">C</div>
                    <h2>Culina</h2>
                </div>

                <nav className="nav-links" aria-label="Main navigation">
                    <NavLink to="/">Home</NavLink>

                    <NavLink
                        to={isLoggedIn ? '/myRecipe' : '/'}
                        onClick={() => !isLoggedIn && setIsOpen(true)}
                    >
                        My Recipes
                    </NavLink>

                    <NavLink
                        to={isLoggedIn ? '/favRecipe' : '/'}
                        onClick={() => !isLoggedIn && setIsOpen(true)}
                    >
                        Favourites
                    </NavLink>

                    <button className="nav-button" onClick={checkLogin} type="button">
                        {isLoggedIn ? 'Logout' : 'Login'}
                        {user?.name ? ` • ${user.name}` : ''}
                    </button>
                </nav>
            </header>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)} />
                </Modal>
            )}
        </>
    )
}