const mongoose = require('mongoose');

const protectedPageSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pageName: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ProtectedPage', protectedPageSchema);