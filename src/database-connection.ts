/* eslint-disable*/
const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/restaurant-order';

mongoose.set('debug', true);
mongoose.set('strictQuery', false);
mongoose
  .connect(connectionString  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection established.'))
  .catch(console.log);

export default mongoose.connection;

