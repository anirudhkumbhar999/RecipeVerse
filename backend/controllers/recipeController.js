import Recipe from '../models/Recipe.js';

export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes' });
    }
};

export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.json(recipe);
    } catch (error) {
        res.status(404).json({ message: 'Recipe not found' });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe' });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe' });
    }
};

export const forkRecipe = async (req, res) => {
    try {
        const original = await Recipe.findById(req.params.id);
        if (!original) return res.status(404).json({ message: 'Original recipe not found' });

        const forked = new Recipe({
            ...original.toObject(),
            _id: undefined,
            title: `${original.title} (Forked)`,
            originalRecipe: original._id,
            createdAt: Date.now()
        });

        await forked.save();
        res.status(201).json(forked);
    } catch (error) {
        res.status(500).json({ message: 'Error forking recipe' });
    }
};
