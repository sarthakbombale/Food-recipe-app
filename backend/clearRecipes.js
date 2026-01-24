require('dotenv').config();
const mongoose = require('mongoose');

async function deleteAllRecipes() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
        
        const Recipes = require('./models/recipeModel.js');
        
        const allRecipes = await Recipes.find();
        console.log(`Found ${allRecipes.length} recipes`);
        
        allRecipes.forEach(recipe => {
            console.log(`- ${recipe.title}`);
        });
        
        const result = await Recipes.deleteMany({});
        console.log(`\nDeleted ${result.deletedCount} recipes`);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

deleteAllRecipes();
