import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [String],
    instructions: String,
    image: String,
    author: String,
    originalRecipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', default: null },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Recipe', recipeSchema); 