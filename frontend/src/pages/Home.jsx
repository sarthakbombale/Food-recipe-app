import React, { useState } from 'react'
import foodRecipe from '../assets/foodRecipe.png'
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const addRecipe = () => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/addRecipe')
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <section className='home'>
                <div className='left'>
                    <span className='eyebrow'>Fresh • Inspired • Shared</span>
                    <h1>Cook stories worth sharing.</h1>
                    <h5>
                        Explore beautifully curated recipes from home cooks and food lovers.
                        Save favorites, discover quick meals, and share your own signature dishes.
                    </h5>

                    <div className='action-row'>
                        <button onClick={addRecipe}>Share your recipe</button>
                        <button className='secondary-btn' onClick={() => navigate('/favRecipe')}>Browse favourites</button>
                    </div>

                    <div className='stats-row'>
                        <div className='stat-item'>
                            <strong>12k+</strong>
                            <span>Recipes</span>
                        </div>
                        <div className='stat-item'>
                            <strong>4.9/5</strong>
                            <span>Community</span>
                        </div>
                        <div className='stat-item'>
                            <strong>3x</strong>
                            <span>Faster discovery</span>
                        </div>
                    </div>
                </div>

                <div className='right'>
                    <div className='hero-card'>
                        <div className='floating-badge'>Trending</div>
                        <img src={foodRecipe} alt='Featured recipe' />
                        <div className='info-card'>
                            <span className='label'>Tonight's pick</span>
                            <strong>Roasted Bowl</strong>
                        </div>
                    </div>
                </div>
            </section>

            <div className='bg'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
                    <path fill='#d4f6e8' fillOpacity='1' d='M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'></path>
                </svg>
            </div>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <InputForm setIsOpen={() => setIsOpen(false)} />
                </Modal>
            )}

            <div className='recipe'>
                <RecipeItems />
            </div>
        </>
    )
}