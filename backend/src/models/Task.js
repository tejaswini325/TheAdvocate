const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: [true, 'Case ID is required']
  },
  taskTitle: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  assignedTo: {  // Make sure this field exists
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assigned user is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);