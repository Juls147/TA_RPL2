const { getProvinces, getCities, getCost } = require('./rajaOngkirService');

const fetchProvinces = async(req, res) => {
    try {
        const provinces = await getProvinces();
        res.json(provinces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//

const fetchCities = async(req, res) => {
    try {
        const { provinceId } = req.params;
        const cities = await getCities(provinceId);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const fetchCost = async(req, res) => {
    try {
        const { origin, destination, weight, courier } = req.body;
        const cost = await getCost(origin, destination, weight, courier);
        res.json(cost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    fetchProvinces,
    fetchCities,
    fetchCost
};