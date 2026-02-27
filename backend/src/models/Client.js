const mongoose = require('mongoose'); 
 
const clientSchema = new mongoose.Schema({ 
  name: { 
    type: String, 
    required: [true, 'Client name is required'], 
    trim: true 
  }, 
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true 
  }, 
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'], 
    trim: true 
  }, 
  address: { 
    type: String, 
    required: [true, 'Address is required'], 
    trim: true 
  }, 
  notes: { 
    type: String, 
    trim: true 
  } 
}, { 
  timestamps: true 
}); 
 
clientSchema.index({ name: 'text', email: 'text', phone: 'text' }); 
 
module.exports = mongoose.model('Client', clientSchema); 
