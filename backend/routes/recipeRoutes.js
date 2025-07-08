import express from 'express';
import {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    forkRecipe
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.post('/:id/fork', forkRecipe);

export default router; 