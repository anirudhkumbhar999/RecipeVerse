const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Get all recipes (with optional search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const recipes = await Recipe.find(query).sort({ createdAt: -1 });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new recipe
router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Edit recipe
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fork recipe
router.post('/:id/fork', async (req, res) => {
    try {
        const orig = await Recipe.findById(req.params.id);
        if (!orig) return res.status(404).json({ error: 'Original recipe not found' });
        const forked = new Recipe({ ...req.body, forkedFrom: orig._id, forks: 0 });
        await forked.save();
        orig.forks += 1;
        await orig.save();
        res.status(201).json(forked);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Like/unlike recipe
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        const idx = recipe.likes.indexOf(userId);
        if (idx === -1) recipe.likes.push(userId);
        else recipe.likes.splice(idx, 1);
        await recipe.save();
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Bookmark/unbookmark recipe
router.post('/:id/bookmark', async (req, res) => {
    try {
        const { userId } = req.body;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        const idx = recipe.bookmarks.indexOf(userId);
        if (idx === -1) recipe.bookmarks.push(userId);
        else recipe.bookmarks.splice(idx, 1);
        await recipe.save();
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add comment
router.post('/:id/comment', async (req, res) => {
    try {
        const { author, text } = req.body;
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        recipe.comments.push({ author, text });
        await recipe.save();
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; 