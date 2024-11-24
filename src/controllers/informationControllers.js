const { getAllBanners } = require('../models/bannerModels');
const { getAllServices } = require('../models/serviceModels');


const fetchBanners = async (req, res) => {
  try {
    const banners = await getAllBanners();
    
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchServices = async (req, res) => {
    try {
      const banners = await getAllServices();
      res.status(200).json(banners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  fetchServices,
  fetchBanners,
};
