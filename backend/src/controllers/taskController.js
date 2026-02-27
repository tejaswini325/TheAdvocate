const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find()
    .populate('caseId')
    .populate('assignedTo', 'name email');

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('caseId')
    .populate('assignedTo', 'name email');

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { task }
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { task }
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTasksByCase = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ caseId: req.params.caseId })
    .populate('caseId')
    .populate('assignedTo', 'name email');

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: { tasks }
  });
});