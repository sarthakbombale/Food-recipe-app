import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const navigate = useNavigate()
    const{id}=useParams()

    useEffect(()=>{
        const getData=async()=>{
            await axios.get(`http://localhost:5000/recipe/${id}`)
            .then(response=>{
                let res=response.data
                setRecipeData({
                    title:res.title,
                    ingredients:res.ingredients.join(","),
                    instructions:res.instructions,
                    time:res.time
                })
            })
        }
        getData()
    },[])

    const onHandleChange = (e) => {
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }
    const onHandleSubmit = async (e) => {
        e.preventDefault()
        console.log(recipeData)
        try {
            const token = localStorage.getItem("token")

            // if a file is selected, send FormData and let browser set Content-Type
            if (recipeData.file) {
                const formData = new FormData()
                formData.append('title', recipeData.title || '')
                formData.append('time', recipeData.time || '')
                formData.append('instructions', recipeData.instructions || '')
                // ensure ingredients is array serialized as JSON for backend
                const ingredients = Array.isArray(recipeData.ingredients) ? recipeData.ingredients : (typeof recipeData.ingredients === 'string' ? recipeData.ingredients.split(',') : [])
                formData.append('ingredients', JSON.stringify(ingredients))
                formData.append('createdBy', JSON.parse(localStorage.getItem('user'))._id)
                formData.append('coverImage', recipeData.file)

                await axios.put(`http://localhost:5000/recipe/${id}`, formData, {
                    headers: { authorization: 'bearer ' + token }
                })
            } else {
                // send JSON payload; normalize ingredients to array
                const payload = {
                    title: recipeData.title,
                    time: recipeData.time,
                    instructions: recipeData.instructions,
                    ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : (typeof recipeData.ingredients === 'string' ? recipeData.ingredients.split(',') : [])
                }
                await axios.put(`http://localhost:5000/recipe/${id}`, payload, {
                    headers: { authorization: 'bearer ' + token }
                })
            }

            navigate('/myRecipe')
        } catch (err) {
            console.error('Edit Error:', err.response?.data || err.message)
            alert('Failed to edit recipe: ' + (err.response?.data?.message || err.message))
        }
    }
    return (
        <>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange} value={recipeData.title}></input>
                    </div>
                    <div className='form-control'>
                        <label>Time</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange} value={recipeData.time}></input>
                    </div>
                    <div className='form-control'>
                        <label>Ingredients</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Instructions</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Recipe Image</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    <button type="submit">Edit Recipe</button>
                </form>
            </div>
        </>
    )
}