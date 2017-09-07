import mongoose from 'mongoose';

function init() {
  mongoose.Promise = Promise;
  const db = mongoose.connect('mongodb://ex03-mongo.dev/ex03-mongo-dev', { useMongoClient: true });
  db.once('open', () => console.log('MongoDB connection successful.'));
  return db;
}

export default init;
