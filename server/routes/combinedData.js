// routes/combinedData.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const axios = require('axios');

app.get('/combined-data', async (req, res) => {
    const { month } = req.query;
  
    try {
      const transactions = await Transaction.find({ dateOfSale: { $regex: new RegExp(`^${month}`, 'i') } });
      
      const totalSaleAmount = await Transaction.aggregate([
        { $match: { dateOfSale: { $regex: new RegExp(`^${month}`, 'i') } } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]);
  
      const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $regex: new RegExp(`^${month}`, 'i') }, sold: true });
      const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $regex: new RegExp(`^${month}`, 'i') }, sold: false });
  
      const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
      ];
  
      const barChartResults = await Promise.all(priceRanges.map(async range => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $regex: new RegExp(`^${month}`, 'i') },
          price: { $gte: range.min, $lt: range.max }
        });
        return { range: range.range, count };
      }));
  
      const categories = await Transaction.aggregate([
        { $match: { dateOfSale: { $regex: new RegExp(`^${month}`, 'i') } } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
  
      res.json({
        transactions,
        statistics: {
          totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
          totalSoldItems,
          totalNotSoldItems
        },
        barChart: barChartResults,
        pieChart: categories
      });
    } catch (error) {
      res.status(500).send('Error fetching combined data');
    }
  });
  
  module.exports = router;