const mongoose = require('mongoose');

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017/crud_op';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  