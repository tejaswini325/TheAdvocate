const Client = require('../models/Client');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllClients = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const clients = await Client.find()
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Client.countDocuments();

  res.status(200).json({
    status: 'success',
    results: clients.length,
    data: {
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

exports.getClient = catchAsync(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new AppError('No client found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      client
    }
  });
});

exports.createClient = catchAsync(async (req, res, next) => {
  const client = await Client.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      client
    }
  });
});

exports.updateClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!client) {
    return next(new AppError('No client found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      client
    }
  });
});

exports.deleteClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    return next(new AppError('No client found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.searchClients = catchAsync(async (req, res, next) => {
  const query = req.params.query;
  
  const clients = await Client.find({
    $text: { $search: query }
  });

  res.status(200).json({
    status: 'success',
    results: clients.length,
    data: {
      clients
    }
  });
});