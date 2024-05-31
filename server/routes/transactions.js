// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  const query = {
    dateOfSale: { $regex: `-${month.padStart(2, '0')}-`, $options: 'i' }
  };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
});

module.exports = router;
