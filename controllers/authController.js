const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('login', { error: null }); // ✅ Explicitly pass null error
};

exports.postLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
      return res.render('login', { 
        error: 'Please enter a valid 10-digit phone number' 
      });
    }
    
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }
    
    req.session.userId = user._id;
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { 
      error: 'Login failed. Please try again.' 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};