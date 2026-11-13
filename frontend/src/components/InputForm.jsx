import React, { useState } from 'react'
import axios from 'axios'
import "../styles/InputForm.css";

export default function InputForm({setIsOpen}) {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
   const [isSignUp,setIsSignUp]=useState(false) 
   const [error,setError]=useState("")

  const handleOnSubmit=async(e)=>{
    e.preventDefault()
    let endpoint=(isSignUp) ? "signUp" : "login"
    const payload = isSignUp ? { name, email, password } : { email, password }
    await axios.post(`http://localhost:5000/user/${endpoint}`, payload)
    .then((res)=>{
        localStorage.setItem("token",res.data.token)
        localStorage.setItem("user",JSON.stringify(res.data.user))
        setIsOpen()
    })
    .catch(data=>setError(data.response?.data?.error))
  }

  return (
    <form className='auth-form' onSubmit={handleOnSubmit}>
      <div className='auth-header'>
        <span className='auth-badge'>Welcome</span>
        <h3>{isSignUp ? 'Create account' : 'Sign in'}</h3>
        <p>{isSignUp ? 'Start sharing your favorite recipes.' : 'Welcome back! Continue cooking.'}</p>
      </div>

      {isSignUp && (
        <div className='form-control'>
          <label>Name</label>
          <input type='text' className='input' value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      )}

      <div className='form-control'>
        <label>Email</label>
        <input type='email' className='input' value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className='form-control'>
        <label>Password</label>
        <input type='password' className='input' value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type='submit' className='auth-submit-btn'>
        {isSignUp ? 'Sign Up' : 'Login'}
      </button>

      {error !== '' && <h6 className='error'>{error}</h6>}

      <button
        type='button'
        className='auth-toggle-btn'
        onClick={() => setIsSignUp((pre) => !pre)}
      >
        {isSignUp ? 'Already have an account? Login' : 'Create new account'}
      </button>
    </form>
  )
}