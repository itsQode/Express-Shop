const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

mongoose.set('strictQuery', false);

const jwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');

const app = express();

app.use(cors());
app.options('*', cors);

//MiddleWares
app.use(express.json());
app.use(morgan('tiny'));
app.use(jwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

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

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database',
  })
  .then(() => {
    console.log('Database Connection is ready on eshopDB');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;

//Server
app.listen(PORT, () => {
  console.log('server is running');
});
