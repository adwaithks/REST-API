const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const postsRoute = require('./routes/postsRoute');
const morgan = require('morgan');
const authRoute = require('./routes/authRoute');

app.use(express.json());
app.use(morgan('dev'));


mongoose.connect(process.env.DB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to MongoDB cluster successfull !');
}).catch(err => {
    console.log('Error connecting to MongoDB cluster !');
})


app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

app.listen(3000, () => {
    console.log('Server up and running !');
})