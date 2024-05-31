// routes/pieChart.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

app.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    const regex = new RegExp(`^${month}`, 'i');
    const query = { dateOfSale: { $regex: regex } };
  
    try {
      const categories = await Transaction.aggregate([
        { $match: query },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
  
      res.json(categories);
    } catch (error) {
      res.status(500).send('Error generating pie chart data');
    }
  });
  
  module.exports = router;