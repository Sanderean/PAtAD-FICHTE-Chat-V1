const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String },
  type: { type: String, enum: ['text', 'image', 'file'], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  timestamp: { type: Date, default: Date.now },
  fileUrl: { type: String } // URL for files and images
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
