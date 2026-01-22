const Studio = require('../models/Studio');

exports.getStudio = async (req, res) => {
  const studio = await Studio.findOne();
  res.render('studio', { studio });
};

exports.postStudio = async (req, res) => {
  const { name, location, specialties } = req.body;
  let studio = await Studio.findOne();
  if (studio) {
    studio.name = name;
    studio.location = location;
    studio.specialties = specialties ? specialties.split(',').map(s => s.trim()) : [];
    await studio.save();
  } else {
    studio = await Studio.create({
      name,
      location,
      specialties: specialties ? specialties.split(',').map(s => s.trim()) : [],
    });
  }
  res.redirect('/studio');
};