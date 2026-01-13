const axios = require('axios');

const paystack = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
    }
});

const initializeTransaction = async (email, amount, metadata = {}, callback_url) => {
    try {
        const body = {
            email,
            amount: Math.round(amount * 100),
            currency: 'GHS',
            metadata
        };
        if (callback_url) body.callback_url = callback_url;

        const response = await paystack.post('/transaction/initialize', body);
        return response.data;

    } catch (error) {

        throw new Error(error.response?.data?.message || 'Paystack initialization failed');
    }
};

const verifyTransaction = async (reference) => {
    try {
        const response = await paystack.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Paystack verification failed');
    }
};

module.exports = {
    initializeTransaction,
    verifyTransaction
};
