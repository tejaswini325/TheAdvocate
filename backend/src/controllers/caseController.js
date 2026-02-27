const Case = require('../models/Case');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllCases = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach(field => delete queryObj[field]);

  let query = Case.find(queryObj)
    .populate('clientId', 'name email')
    .populate('assignedTo', 'name email')
    .skip(skip)
    .limit(limit);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const cases = await query;
  const total = await Case.countDocuments(queryObj);

  res.status(200).json({
    status: 'success',
    results: cases.length,
    data: {
      cases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

exports.getCase = catchAsync(async (req, res, next) => {
  const caseItem = await Case.findById(req.params.id)
    .populate('clientId')
    .populate('assignedTo', 'name email');

  if (!caseItem) {
    return next(new AppError('No case found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      case: caseItem
    }
  });
});

exports.createCase = catchAsync(async (req, res, next) => {
  const caseItem = await Case.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      case: caseItem
    }
  });
});

exports.updateCase = catchAsync(async (req, res, next) => {
  const caseItem = await Case.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('clientId')
    .populate('assignedTo', 'name email');

  if (!caseItem) {
    return next(new AppError('No case found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      case: caseItem
    }
  });
});

exports.deleteCase = catchAsync(async (req, res, next) => {
  const caseItem = await Case.findByIdAndDelete(req.params.id);

  if (!caseItem) {
    return next(new AppError('No case found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getCasesByClient = catchAsync(async (req, res, next) => {
  const cases = await Case.find({ clientId: req.params.clientId })
    .populate('assignedTo', 'name email');

  res.status(200).json({
    status: 'success',
    results: cases.length,
    data: {
      cases
    }
  });
});

exports.searchCases = catchAsync(async (req, res, next) => {
  const { query } = req.params;

  const cases = await Case.find({
    $text: { $search: query }
  })
    .populate('clientId', 'name')
    .populate('assignedTo', 'name');

  res.status(200).json({
    status: 'success',
    results: cases.length,
    data: {
      cases
    }
  });
});