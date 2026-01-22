require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const { connect } = require('./config/db');

// Connect to MongoDB
connect();

// Import models
const Artist = require('./models/Artist');
const Asset = require('./models/Asset');
const Studio = require('./models/Studio');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth.routes');
const studioRoutes = require('./routes/studio.routes');
const artistRoutes = require('./routes/artist.routes');
const assetRoutes = require('./routes/asset.routes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ FIXED: Login routes
app.get('/login', (req, res) => {
    // ✅ REMOVE this check or comment it out
    // if (req.session.userId) {
    //     return res.redirect('/home');
    // }
    
    res.render('login', { 
        title: 'Login',
        error: null
    });
});

app.post('/login', async (req, res) => {
    const { phone } = req.body;
    
    try {
        let user = await User.findOne({ phone });
        if (!user) {
            user = await User.create({ phone });
        }
        
        req.session.userId = user._id;
        res.redirect('/home');
    } catch (error) {
        res.render('login', { 
            title: 'Login', 
            error: 'Login failed. Please try again.' 
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Protected routes middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Home page
app.get('/home', requireAuth, async (req, res) => {
    try {
        const studioCount = await Studio.countDocuments();
        const artistCount = await Artist.countDocuments();
        const assetCount = await Asset.countDocuments();
        
        res.render('home', {
            title: 'Home',
            studioCount,
            artistCount,
            assetCount
        });
    } catch (error) {
        res.render('home', {
            title: 'Home',
            studioCount: 0,
            artistCount: 0,
            assetCount: 0
        });
    }
});

// Dashboard
app.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const studioCount = await Studio.countDocuments();
        const artistCount = await Artist.countDocuments();
        const assetCount = await Asset.countDocuments();
        
        let checklistProgress = 0;
        if (studioCount) checklistProgress += 33;
        if (artistCount) checklistProgress += 33;
        if (assetCount) checklistProgress += 34;
        
        res.render('dashboard', {
            title: 'Dashboard',
            studioCount,
            artistCount,
            assetCount,
            checklistProgress
        });
    } catch (error) {
        res.render('dashboard', {
            title: 'Dashboard',
            studioCount: 0,
            artistCount: 0,
            assetCount: 0,
            checklistProgress: 0
        });
    }
});

// Mount other routes
app.use('/studio', studioRoutes);
app.use('/artists', artistRoutes);
app.use('/assets', assetRoutes);

// Root route
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// 404
app.use((req, res) => {
    res.status(404).render('404', { 
        title: '404',
        message: 'Page not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { 
        title: 'Error',
        message: 'Something went wrong' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});