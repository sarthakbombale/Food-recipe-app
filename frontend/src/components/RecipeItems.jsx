import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RecipeItems() {
    const recipes = useLoaderData()
    const [allRecipes, setAllRecipes] = useState(recipes)
    const navigate = useNavigate()

    const path = window.location.pathname === "/myRecipe"
    const token = localStorage.getItem('token')
    const userId = JSON.parse(localStorage.getItem('user'))?._id
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []

    useEffect(() => {
        setAllRecipes(recipes)
    }, [recipes])

    // ---------------- DELETE RECIPE ----------------
    const onDelete = async (id) => {
        try {
            if (!token) {
                toast.warning('Login required to delete')
                return
            }

            await axios.delete(`http://localhost:5000/recipe/${id}`, {
                headers: { authorization: 'bearer ' + token }
            })

            setAllRecipes(prev => prev.filter(recipe => recipe._id !== id))

            const filteredFav = favItems.filter(recipe => recipe._id !== id)
            localStorage.setItem("fav", JSON.stringify(filteredFav))

            toast.success('Recipe deleted successfully 🗑️')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete recipe')
        }
    }

    // ---------------- LIKE / FAV RECIPE ----------------
    const favRecipe = (item) => {
        if (token) {
            const currentlyLiked = (item.likes || []).map(l => String(l)).includes(userId)

            axios.post(
                `http://localhost:5000/recipe/${item._id}/like`,
                {},
                { headers: { authorization: 'bearer ' + token } }
            )
                .then(() => {
                    setAllRecipes(prev =>
                        prev.map(r => {
                            if (r._id !== item._id) return r
                            let likesArr = Array.isArray(r.likes) ? [...r.likes.map(l => String(l))] : []

                            if (currentlyLiked) {
                                likesArr = likesArr.filter(id => id !== userId)
                            } else {
                                likesArr.push(userId)
                            }

                            return { ...r, likes: likesArr }
                        })
                    )
                })
                .catch(() => toast.error('Something went wrong'))
        } else {
            const exists = favItems.some(r => r._id === item._id)
            favItems = exists
                ? favItems.filter(r => r._id !== item._id)
                : [...favItems, item]

            localStorage.setItem("fav", JSON.stringify(favItems))
            toast.info(exists ? 'Removed from favourites' : 'Added to favourites ❤️')
        }
    }

    const viewRecipe = (id) => {
        navigate(`/recipe/${id}`)
    }

    return (
        <>
            {/* Toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={2500}
                newestOnTop
                pauseOnHover
                closeOnClick
                draggable
                theme="light"
            />

            {/* Main content */}
            <div className="card-container">
                {allRecipes?.length > 0 ? (
                    allRecipes.map((item) => (
                        <div key={item._id} className="card">
                            {/* Recipe Image */}
                            <img
                                src={
                                    item.coverImage
                                        ? `http://localhost:5000/images/${item.coverImage}`
                                        : foodImg
                                }
                                alt={item.title}
                                style={{
                                    width: '100%',
<<<<<<< HEAD
                                    height: '100px',
                                    objectFit: 'cover',
=======
                                    height: '180px',
                                    objectFit: 'cover',
                                    display: 'block',
>>>>>>> d81b541 (Updated recipe app)
                                    borderTopLeftRadius: '6px',
                                    borderTopRightRadius: '6px'
                                }}
                            />

<<<<<<< HEAD
=======

>>>>>>> d81b541 (Updated recipe app)
                            {/* Card Body */}
                            <div className="card-body">
                                <div className="title">{item.title}</div>

                                <div className="icons">
                                    <div className="timer">
                                        <BsStopwatchFill /> {item.time}
                                    </div>

                                    {!path ? (
                                        <>
                                            <FaHeart
                                                onClick={() => favRecipe(item)}
                                                style={{
                                                    cursor: 'pointer',
                                                    transition: '0.2s',
                                                    color: token
                                                        ? (item.likes || [])
                                                            .map(l => String(l))
                                                            .includes(userId)
                                                            ? 'red'
                                                            : '#999'
                                                        : favItems.some(res => res._id === item._id)
                                                            ? 'red'
                                                            : '#999'
                                                }}
                                            />
                                            <span style={{ marginLeft: 6, fontSize: 12 }}>
                                                {item.likes?.length || 0}
                                            </span>
                                        </>
                                    ) : (
                                        <div className="action">
                                            <Link
                                                to={`/editRecipe/${item._id}`}
                                                className="editIcon"
                                                aria-label="Edit recipe"
                                            >
                                                <FaEdit />
                                            </Link>

                                            <MdDelete
                                                className="deleteIcon"
                                                aria-label="Delete recipe"
                                                onClick={() =>
                                                    toast.info(
                                                        <div>
                                                            <p style={{ marginBottom: 8 }}>
                                                                Delete this recipe?
                                                            </p>
                                                            <button
                                                                onClick={() => onDelete(item._id)}
                                                                style={{
                                                                    background: 'red',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    padding: '4px 8px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Yes, delete
                                                            </button>
                                                        </div>,
                                                        { autoClose: false }
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* View Recipe Button */}
                            <button
                                onClick={() => viewRecipe(item._id)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#e63946',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0 0 6px 6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                View Recipe
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>
                        No recipes found
                    </p>
                )}
            </div>
        </>
    )
}
