const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 
require('dotenv').config(); 
const User = require('./models/User'); 
const Client = require('./models/Client'); 
const Case = require('./models/Case'); 
const Task = require('./models/Task'); 
const Document = require('./models/Document'); 
 
const users = [ 
  { 
    name: 'Admin User', 
    email: 'admin@example.com', 
    password: 'password123', 
    role: 'Admin' 
  }, 
  { 
    name: 'John Doe', 
    email: 'john@example.com', 
    password: 'password123', 
    role: 'Associate' 
  }, 
  { 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    password: 'password123', 
    role: 'Associate' 
  } 
]; 
 
const clients = [ 
  { 
    name: 'Acme Corporation', 
    email: 'contact@acme.com', 
    phone: '+1-555-0123', 
    address: '123 Business Ave, New York, NY 10001', 
    notes: 'Corporate client specializing in technology' 
  }, 
  { 
    name: 'Robert Johnson', 
    email: 'robert.j@email.com', 
    phone: '+1-555-0124', 
    address: '456 Oak Street, Los Angeles, CA 90001', 
    notes: 'Individual client - personal injury case' 
  }, 
  { 
    name: 'Smith Family Trust', 
    email: 'trust@smithfamily.com', 
    phone: '+1-555-0125', 
    address: '789 Pine Road, Chicago, IL 60601', 
    notes: 'Estate planning and trust management' 
  } 
]; 
 
const seedDatabase = async () => { 
  try { 
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log('Connected to MongoDB'); 
 
    // Clear existing data 
    await User.deleteMany(); 
    await Client.deleteMany(); 
    await Case.deleteMany(); 
    await Task.deleteMany(); 
    await Document.deleteMany(); 
 
    // Hash passwords and create users 
    const hashedUsers = await Promise.all( 
      users.map(async (user) => ({ 
        ...user, 
        password: await bcrypt.hash(user.password, 12) 
      })) 
    ); 
    const createdUsers = await User.insertMany(hashedUsers); 
    console.log('Users seeded'); 
 
    // Create clients 
    const createdClients = await Client.insertMany(clients); 
    console.log('Clients seeded'); 
 
    // Create cases 
    const cases = [ 
      { 
        caseTitle: 'Intellectual Property Dispute', 
        caseNumber: 'CASE-2024-001', 
        clientId: createdClients[0]._id, 
        caseType: 'Intellectual Property', 
        status: 'In Progress', 
        priority: 'High', 
        description: 'Patent infringement case involving software technology', 
        startDate: new Date('2024-01-15'), 
        nextHearingDate: new Date('2024-03-20'), 
        assignedTo: createdUsers[1]._id 
      }, 
      { 
        caseTitle: 'Personal Injury Claim', 
        caseNumber: 'CASE-2024-002', 
        clientId: createdClients[1]._id, 
        caseType: 'Personal Injury', 
        status: 'Open', 
        priority: 'Medium', 
        description: 'Auto accident injury claim', 
        startDate: new Date('2024-02-01'), 
        nextHearingDate: new Date('2024-04-15'), 
        assignedTo: createdUsers[2]._id 
      }, 
      { 
        caseTitle: 'Estate Planning', 
        caseNumber: 'CASE-2024-003', 
        clientId: createdClients[2]._id, 
        caseType: 'Estate Planning', 
        status: 'Pending Review', 
        priority: 'Low', 
        description: 'Family trust and will preparation', 
        startDate: new Date('2024-02-10'), 
        assignedTo: createdUsers[0]._id 
      } 
    ]; 
    const createdCases = await Case.insertMany(cases); 
    console.log('Cases seeded'); 
 
    // Create tasks 
    const tasks = [ 
      { 
        caseId: createdCases[0]._id, 
        taskTitle: 'Review patent documentation', 
        dueDate: new Date('2024-03-01'), 
        status: 'Completed', 
        completionPercentage: 100 
      }, 
      { 
        caseId: createdCases[0]._id, 
        taskTitle: 'Prepare witness statements', 
        dueDate: new Date('2024-03-10'), 
        status: 'Pending', 
        completionPercentage: 30 
      }, 
      { 
        caseId: createdCases[1]._id, 
        taskTitle: 'Gather medical records', 
        dueDate: new Date('2024-03-05'), 
        status: 'Pending', 
        completionPercentage: 60 
      } 
    ]; 
    await Task.insertMany(tasks); 
    console.log('Tasks seeded'); 
 
    // Create documents 
    const documents = [ 
      { 
        caseId: createdCases[0]._id, 
        documentName: 'Patent Filing.pdf', 
        documentType: 'Legal Document', 
        status: 'Reviewed' 
      }, 
      { 
        caseId: createdCases[0]._id, 
        documentName: 'Court Order.pdf', 
        documentType: 'Court Document', 
        status: 'Approved' 
      }, 
      { 
        caseId: createdCases[1]._id, 
        documentName: 'Medical Report.pdf', 
        documentType: 'Medical Record', 
        status: 'Pending' 
      } 
    ]; 
    await Document.insertMany(documents); 
    console.log('Documents seeded'); 
 
    console.log('Database seeded successfully!'); 
    process.exit(0); 
  } catch (error) { 
    console.error('Error seeding database:', error); 
    process.exit(1); 
  } 
}; 
 
seedDatabase(); 
