import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', { email: req.body.email, username: req.body.username });
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email or username' });
        }

        const user = new User({ username, email, password });
        await user.save();
        console.log('User created successfully:', user._id);

        // Immediately log in after signup
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error('Signup error:', err);
        if (err.name === 'MongoServerSelectionError' || err.message.includes('buffering')) {
            res.status(503).json({ error: 'Database connection failed. Please try again.' });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'User already exists' });
        } else {
            res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', { email: req.body.email });
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log('Login successful for user:', email);
        res.json({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        if (err.name === 'MongoServerSelectionError' || err.message.includes('buffering')) {
            res.status(503).json({ error: 'Database connection failed. Please try again.' });
        } else {
            res.status(500).json({ error: 'Server error. Please try again.' });
        }
    }
});

export default router; 