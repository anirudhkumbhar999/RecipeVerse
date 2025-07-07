require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Sample Recipe model
const Recipe = mongoose.model('Recipe', new mongoose.Schema({
    title: String,
    description: String,
}));

// Sample route
app.get('/api/recipes', async (req, res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 