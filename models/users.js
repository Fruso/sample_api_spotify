import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const userSchema = Schema({
  title: String,
  description: String
});

module.exports = mongoose.model('user', userSchema);
