const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true }, // could be userId or username
    image: { type: String },
    ingredients: [String],
    instructions: { type: String, required: true },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    forkedFrom: { type: String }, // original recipe id or author
    comments: [commentSchema],
    likes: [{ type: String }], // user ids
    bookmarks: [{ type: String }], // user ids
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema); 