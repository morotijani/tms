const axios = require('axios');

const paystack = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
    }
});

const initializeTransaction = async (email, amount) => {
    try {
        const response = await paystack.post('/transaction/initialize', {
            email,
            amount: amount * 100, // Paystack uses kobo/pesewas
            currency: 'GHS'
        });
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
