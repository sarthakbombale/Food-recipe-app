import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from 'axios';

import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from './pages/EditRecipe.jsx';
import RecipeDetails from './pages/RecipeDetails.jsx';
import ErrorBoundary from './pages/ErrorBoundary.jsx';

// ====================== LOADERS ======================

// GET ALL RECIPES
const getAllRecipes = async () => {
  const res = await axios.get('http://localhost:5000/recipe');
  return res.data;
};

// GET MY RECIPES
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await axios.get('http://localhost:5000/recipe');
  // createdBy may be a string id or an object (populated). Compare robustly.
  return res.data.filter(item => {
    const createdBy = item.createdBy;
    if (!user?._id) return false;
    if (!createdBy) return false;
    if (typeof createdBy === 'string') return createdBy === user._id;
    if (typeof createdBy === 'object') return (createdBy._id ? createdBy._id === user._id : String(createdBy) === user._id);
    return false;
  });
};

// GET FAVORITE RECIPES
const getFavRecipes = async () => {
  const localFav = JSON.parse(localStorage.getItem("fav")) || [];
  const user = JSON.parse(localStorage.getItem("user"))

  // If user is logged in, prefer server-side likes
  if (user && user._id) {
    try {
      const res = await axios.get('http://localhost:5000/recipe')
      return res.data.filter(item => {
        const likes = item.likes || []
        return likes.map(l => String(l)).includes(user._id)
      })
    } catch (err) {
      console.warn('Failed to fetch recipes for favourites, falling back to localFav', err.message)
      return localFav
    }
  }

  // anonymous: return local storage favourites
  return localFav
}

// GET SINGLE RECIPE (VIEW)
const getRecipe = async ({ params }) => {
  try {
    if (!params.id) {
      throw new Error("Recipe ID missing");
    }

    // Fetch recipe
    const recipeRes = await axios.get(
      `http://localhost:5000/recipe/${params.id}`
    );
    let recipe = recipeRes.data;

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Fetch creator email
    let userEmail = "Unknown Chef";
    if (recipe.createdBy) {
      try {
        const userRes = await axios.get(
          `http://localhost:5000/user/${recipe.createdBy}`
        );
        userEmail = userRes.data.email;
      } catch (userError) {
        console.warn("Could not fetch user email:", userError.message);
      }
    }

    return {
      ...recipe,
      email: userEmail
    };
  } catch (error) {
    console.error("Recipe loader error:", error.message);
    return null;
  }
};

// ====================== ROUTER ======================

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    hydrateFallbackElement: <div>Loading...</div>,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: getAllRecipes,
      },
      {
        path: "/myRecipe",
        element: <Home />,
        loader: getMyRecipes,
      },
      {
        path: "/favRecipe",
        element: <Home />,
        loader: getFavRecipes,
      },
      {
        path: "/addRecipe",
        element: <AddFoodRecipe />,
      },
      {
        path: "/editRecipe/:id",
        element: <EditRecipe />,
      },
      {
        path: "/recipe/:id",
        element: <RecipeDetails />,
        loader: getRecipe,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

// ====================== APP ======================

export default function App() {
  return <RouterProvider router={router} />;
}
