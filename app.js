const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

const api = process.env.API_URL;

const app = express();

//MiddleWares
app.use(express.json());
app.use(morgan('tiny'));

app.get(`${api}/products`, (req, res, next) => {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'some_url',
  };
  res.json(product);
});

app.post(`${api}/products`, (req, res, next) => {
  const newProduct = req.body;
  const product = {
    id: newProduct.id,
    name: newProduct.name,
    image: newProduct.image,
  };
  res.json(product);
});

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
