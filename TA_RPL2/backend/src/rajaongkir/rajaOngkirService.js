const axios = require('axios');

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter';

const rajaOngkir = axios.create({
    baseURL: RAJAONGKIR_BASE_URL,
    headers: {
        key: RAJAONGKIR_API_KEY
    }
});

const getProvinces = async() => {
    try {
        const response = await rajaOngkir.get('/province');
        return response.data.rajaongkir.results;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCities = async(provinceId) => {
    try {
        const response = await rajaOngkir.get(`/city?province=${provinceId}`);
        return response.data.rajaongkir.results;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCost = async(origin, destination, weight, courier) => {
    try {
        const response = await rajaOngkir.post('/cost', {
            origin,
            destination,
            weight,
            courier
        });
        return response.data.rajaongkir.results;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getProvinces,
    getCities,
    getCost
};