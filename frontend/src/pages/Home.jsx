import React, { useState } from 'react'
import heroIllustration from '../assets/culina-hero.svg'
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
                        <img src={heroIllustration} alt='Culina food illustration' />
                        <div className='info-card'>
                            <span className='label'>Tonight's pick</span>
                            <strong>Roasted Bowl</strong>
                        </div>
                    </div>
                </div>
            </section>

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