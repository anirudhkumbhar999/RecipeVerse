import express from 'express';
import { getRecipes, addRecipe } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getRecipes);
router.post('/', addRecipe);

export default router; 