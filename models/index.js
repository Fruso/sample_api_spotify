import mongoose from 'mongoose';

import User from './user';


const connectDb = () => {
  return mongoose.connect('test222');
};

const models = { User};

export { connectDb };

export default models;
