// routes/statistics.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

app.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const regex = new RegExp(`^${month}`, 'i');
    const query = { dateOfSale: { $regex: regex } };
  
    try {
      const totalSaleAmount = await Transaction.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]);
  
      const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
      const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });
  
      res.json({
        totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
        totalSoldItems,
        totalNotSoldItems
      });
    } catch (error) {
      res.status(500).send('Error calculating statistics');
    }
  });
  
  module.exports = router;