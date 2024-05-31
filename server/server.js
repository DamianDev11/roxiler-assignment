const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('your_mongodb_connection_string', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.use("/api", api);
app.use("/", home);


Promise.all([connectToDb()])
  .then(() =>
    app.listen(port, () => console.log(`Server is running on PORT ${port}`))
  )
  .catch((error) => {
    console.error(`MongoDB Atlas Error: ${error}`);
    process.exit();
  });