import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

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

// Root route for server status
app.get('/', (req, res) => {
    res.send('Server is running! Visit /api/recipes for the API.');
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); 