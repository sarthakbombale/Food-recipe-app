import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const navigate = useNavigate()
    const onHandleChange = (e) => {
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }
    const onHandleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("title", recipeData.title)
        formData.append("time", recipeData.time)
        formData.append("ingredients", JSON.stringify(recipeData.ingredients || []))
        formData.append("instructions", recipeData.instructions)
        if (recipeData.file) {
            formData.append("coverImage", recipeData.file)
        }
        formData.append("createdBy", JSON.parse(localStorage.getItem("user"))._id)

        await axios.post("http://localhost:5000/recipe", formData, {
            headers: {
                'authorization': 'bearer ' + localStorage.getItem("token")
            }
        })
            .then(() => navigate("/"))
            .catch(error => {
                console.error("Upload Error:", error.response?.data || error.message)
                alert("Failed to add recipe: " + (error.response?.data?.message || error.message))
            })

    }
    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    )
}