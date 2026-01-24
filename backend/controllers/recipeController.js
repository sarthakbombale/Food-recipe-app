const Recipes = require("../models/recipeModel");

// GET ALL RECIPES
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// GET SINGLE RECIPE
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id).populate('comments.user', 'name email');

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Invalid recipe ID" });
  }
};

// ADD RECIPE
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time, createdBy } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    if (!title || !ingredients || !instructions || !time || !createdBy) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      parsedIngredients = JSON.parse(ingredients);
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients: parsedIngredients,
      instructions,
      time,
      coverImage,
      createdBy
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Add Recipe Error:", error);
    res.status(500).json({ message: "Failed to add recipe", error: error.message });
  }
};

// EDIT RECIPE
const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Only the creator can edit
    if (req.user && req.user.id !== recipe.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this recipe" });
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

// DELETE RECIPE
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Only the creator can delete
    if (req.user && req.user.id !== recipe.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

//view recipe
const viewRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("createdBy", "email");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to view recipe" });
  }
};


// add comment 
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user?.id || req.body.userId; // auth or manual

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.comments.push({ user: userId, text });
    await recipe.save();

    // populate comment user info before returning
    await recipe.populate({ path: 'comments.user', select: 'name email' });

    res.status(201).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Toggle like for a recipe
const toggleLike = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const idx = recipe.likes.findIndex((id) => id.toString() === userId);
    if (idx === -1) {
      recipe.likes.push(userId);
    } else {
      recipe.likes.splice(idx, 1);
    }

    await recipe.save();
    return res.status(200).json({ likes: recipe.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like" });
  }
};



module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  viewRecipe,
  addComment,
  toggleLike,
};
