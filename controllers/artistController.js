const Artist = require('../models/Artist');
const Studio = require('../models/Studio');

// Get all artists
exports.getArtists = async (req, res) => {
  try {
    const studio = await Studio.findOne();
    const artists = await Artist.find({ studio: studio ? studio._id : null });
    res.render('artists', { artists });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).render('error', { message: 'Failed to load artists' });
  }
};

// Create new artist
exports.postArtist = async (req, res) => {
  try {
    const { name, role } = req.body;
    
    // Validate input
    if (!name || !role) {
      return res.status(400).render('artists', { 
        error: 'Name and role are required',
        artists: await Artist.find()
      });
    }
    
    const studio = await Studio.findOne();
    if (studio) {
      await Artist.create({ 
        name, 
        role, 
        studio: studio._id 
      });
    } else {
      // If no studio exists, create artist without studio reference
      await Artist.create({ name, role });
    }
    
    res.redirect('/artists');
  } catch (error) {
    console.error('Error creating artist:', error);
    res.status(500).render('error', { message: 'Failed to create artist' });
  }
};

// Update artist
exports.updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).render('error', { message: 'Artist not found' });
    }
    
    artist.name = name || artist.name;
    artist.role = role || artist.role;
    await artist.save();
    
    res.redirect('/artists');
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).render('error', { message: 'Failed to update artist' });
  }
};

// Delete artist
exports.deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artist = await Artist.findById(id);
    if (!artist) {
      return res.status(404).render('error', { message: 'Artist not found' });
    }
    
    await Artist.findByIdAndDelete(id);
    res.redirect('/artists');
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).render('error', { message: 'Failed to delete artist' });
  }
};

// Get artist by ID
exports.getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).render('error', { message: 'Artist not found' });
    }
    
    res.render('artist-detail', { artist });
  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).render('error', { message: 'Failed to load artist details' });
  }
};