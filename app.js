const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const app = express();

app.use(cors());
app.options('*', cors);

//MiddleWares
app.use(express.json());
app.use(morgan('tiny'));

//Routes
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');

const api = process.env.API_URL;

app.use(`${api}/products`, productRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/categories`, categoryRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: 'eshop-database',
  })
  .then(() => {
    console.log('Database connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log('serves is running http://localhost:3000');
});
