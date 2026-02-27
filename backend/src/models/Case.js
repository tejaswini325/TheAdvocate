const mongoose = require('mongoose'); 
 
const caseSchema = new mongoose.Schema({ 
  caseTitle: { 
    type: String, 
    required: [true, 'Case title is required'], 
    trim: true 
  }, 
  caseNumber: { 
    type: String, 
    required: [true, 'Case number is required'], 
    unique: true, 
    trim: true 
  }, 
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: [true, 'Client is required'] 
  }, 
  caseType: { 
    type: String, 
    required: [true, 'Case type is required'], 
    trim: true 
  }, 
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Pending Review', 'Closed'], 
    default: 'Open' 
  }, 
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  }, 
  description: { 
    type: String, 
    required: [true, 'Description is required'], 
    trim: true 
  }, 
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'], 
    default: Date.now 
  }, 
  nextHearingDate: { 
    type: Date 
  }, 
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Assigned attorney is required'] 
  } 
}, { 
  timestamps: true 
}); 
 
caseSchema.index({ caseTitle: 'text', caseNumber: 'text' }); 
caseSchema.index({ status: 1, priority: 1 }); 
caseSchema.index({ nextHearingDate: 1 }); 
 
module.exports = mongoose.model('Case', caseSchema); 
