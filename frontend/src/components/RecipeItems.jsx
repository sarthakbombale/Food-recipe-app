import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
    const recipes = useLoaderData()
    const [allRecipes, setAllRecipes] = useState(recipes)
    let path = window.location.pathname === "/myRecipe" ? true : false
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
    const [isFavRecipe, setIsFavRecipe] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const userId = JSON.parse(localStorage.getItem('user'))?._id

    useEffect(() => {
        setAllRecipes(recipes)
    }, [recipes])

    const onDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return alert('Login required to delete')

            await axios.delete(`http://localhost:5000/recipe/${id}`, { headers: { authorization: 'bearer ' + token } })
            setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
            let filterItem = favItems.filter(recipe => recipe._id !== id)
            localStorage.setItem("fav", JSON.stringify(filterItem))
        } catch (err) {
            console.error('Delete error', err.response?.data || err.message)
            alert('Failed to delete recipe: ' + (err.response?.data?.message || err.message))
        }
    }

    const favRecipe = (item) => {
        const token = localStorage.getItem("token")
        if (token) {
            // determine if user already liked
            const currentlyLiked = (item.likes || []).map(l => String(l)).includes(userId)
            // toggle like on server
            axios.post(`http://localhost:5000/recipe/${item._id}/like`, {}, { headers: { 'authorization': 'bearer ' + token } })
                .then(res => {
                    // update local list by toggling user's id in likes array
                    setAllRecipes(prev => prev.map(r => {
                        if (r._id !== item._id) return r
                        const likesArr = Array.isArray(r.likes) ? [...r.likes.map(l => String(l))] : []
                        if (currentlyLiked) {
                            // remove userId
                            const idx = likesArr.indexOf(userId)
                            if (idx !== -1) likesArr.splice(idx, 1)
                        } else {
                            likesArr.push(userId)
                        }
                        return { ...r, likes: likesArr }
                    }))
                })
                .catch(err => console.error(err))
        } else {
            let filterItem = favItems.filter(recipe => recipe._id !== item._id)
            favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
            localStorage.setItem("fav", JSON.stringify(favItems))
            setIsFavRecipe(pre => !pre)
        }
    }

    const viewRecipe = (id) => {
        console.log("Navigating to recipe ID:", id)
        navigate(`/recipe/${id}`)
    }

    return (
        <>
            <div className='card-container'>
                {allRecipes?.map((item, index) => {
                    return (
                        <div key={index} className='card'>
                            <img
                                src={`http://localhost:5000/images/${item.coverImage}`}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover'
                                }}
                            />
                            <div className='card-body'>
                                <div className='title'>{item.title}</div>
                                <div className='icons'>
                                    <div className='timer'><BsStopwatchFill />{item.time}</div>
                                    {(!path) ? (
                                        <>
                                            <FaHeart onClick={() => favRecipe(item)}
                                                style={{ color: (token ? ((item.likes || []).map(l => String(l)).includes(userId)) : (favItems.some(res => res._id === item._id))) ? "red" : "" }} />
                                            <span style={{ marginLeft: 6, fontSize: 12 }}>{item.likes ? item.likes.length : 0}</span>
                                        </>
                                    ) :
                                        <div className='action'>
                                            <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                            <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                        </div>
                                    }
                                </div>
                            </div>
                            <button
                                onClick={() => viewRecipe(item._id)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}
                            >
                                View Recipe
                            </button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}