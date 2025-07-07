import Recipe from '../models/Recipe.js';

export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

export const addRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, author, image } = req.body;
        const newRecipe = new Recipe({ title, ingredients, instructions, author, image });
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add recipe' });
    }
}; 