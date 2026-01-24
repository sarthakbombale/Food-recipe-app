const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getRecipe,
  getRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  viewRecipe,
  addComment,
  toggleLike,
} = require('../controllers/recipeController');

const verifyToken = require('../middleware/auth');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage });

router.get("/", getRecipes);


// ✅ NEW ROUTES
router.get("/:id/view", viewRecipe);
router.post("/:id/comment", verifyToken, addComment);

router.get("/:id", getRecipe);

// ✅ Apply multer only on addRecipe POST route
router.post("/", verifyToken, upload.single('coverImage'), addRecipe);

// Allow updating coverImage via multer on PUT
router.put("/:id", verifyToken, upload.single('coverImage'), editRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

// like endpoint
router.post('/:id/like', verifyToken, toggleLike);

module.exports = router;

