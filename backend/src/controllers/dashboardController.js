const Case = require('../models/Case'); 
const Task = require('../models/Task'); 
const Document = require('../models/Document'); 
const catchAsync = require('../utils/catchAsync'); 
 
exports.getStats = catchAsync(async (req, res, next) => {
  // Cases by status 
  const casesByStatus = await Case.aggregate([ 
    { 
      $group: { 
        _id: '$status', 
        count: { $sum: 1 } 
      } 
    } 
  ]); 
 
  // Cases by priority 
  const casesByPriority = await Case.aggregate([ 
    { 
      $group: { 
        _id: '$priority', 
        count: { $sum: 1 } 
      } 
    } 
  ]); 
 
  // Total cases count 
  const totalCases = await Case.countDocuments(); 
  const openCases = await Case.countDocuments({ status: { $ne: 'Closed' } }); 
  const closedCases = await Case.countDocuments({ status: 'Closed' }); 
 
  // Tasks stats 
  const totalTasks = await Task.countDocuments(); 
  const completedTasks = await Task.countDocuments({ status: 'Completed' }); 
  const tasksCompletion = totalTasks 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0; 
 
  // Upcoming hearings (next 7 days) 
  const today = new Date(); 
  const nextWeek = new Date(); 
  nextWeek.setDate(today.getDate() + 7); 
 
  const upcomingHearings = await Case.find({ 
    nextHearingDate: { 
      $gte: today, 
      $lte: nextWeek 
    } 
  }) 
  .populate('clientId', 'name') 
  .select('caseTitle caseNumber nextHearingDate clientId') 
  .sort('nextHearingDate'); 
 
  // Documents by status 
  const documentsByStatus = await Document.aggregate([ 
    { 
      $group: { 
        _id: '$status', 
        count: { $sum: 1 } 
      } 
    } 
  ]); 
 
  // Recent cases 
  const recentCases = await Case.find() 
    .populate('clientId', 'name') 
    .populate('assignedTo', 'name') 
    .sort('-createdAt') 
    .limit(5); 
 
  res.status(200).json({ 
    status: 'success', 
    data: { 
      overview: { 
        totalCases, 
        openCases, 
        closedCases, 
        totalTasks, 
        tasksCompletion 
      }, 
      casesByStatus, 
      casesByPriority, 
      documentsByStatus, 
      upcomingHearings, 
      recentCases 
    } 
  }); 
}); 
