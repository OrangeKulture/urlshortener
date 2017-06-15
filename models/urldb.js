const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dbFormat = new Schema({
  originalUrl: String,
  shortUrl: String
}, {timestamps: true});

const ModelClass = mongoose.model('urlDb', dbFormat);
module.exports = ModelClass;
