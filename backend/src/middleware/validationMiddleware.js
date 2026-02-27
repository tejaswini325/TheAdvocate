const { body, validationResult } = require('express-validator'); 
 
const validateRequest = (req, res, next) => { 
  const errors = validationResult(req); 
  if (!errors.isEmpty()) { 
    return res.status(400).json({ 
      status: 'error', 
      errors: errors.array() 
    }); 
  } 
  next(); 
}; 
 
exports.validateRegister = [ 
  body('name').notEmpty().withMessage('Name is required'), 
  body('email').isEmail().withMessage('Please provide a valid email'), 
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), 
  validateRequest 
]; 
 
exports.validateLogin = [ 
  body('email').isEmail().withMessage('Please provide a valid email'), 
  body('password').notEmpty().withMessage('Password is required'), 
  validateRequest 
]; 
 
exports.validateClient = [ 
  body('name').notEmpty().withMessage('Client name is required'), 
  body('email').isEmail().withMessage('Please provide a valid email'), 
  body('phone').notEmpty().withMessage('Phone number is required'), 
  body('address').notEmpty().withMessage('Address is required'), 
  validateRequest 
]; 
 
exports.validateCase = [ 
  body('caseTitle').notEmpty().withMessage('Case title is required'), 
  body('caseNumber').notEmpty().withMessage('Case number is required'), 
  body('clientId').isMongoId().withMessage('Valid client ID is required'), 
  body('caseType').notEmpty().withMessage('Case type is required'), 
  body('description').notEmpty().withMessage('Description is required'), 
  body('assignedTo').isMongoId().withMessage('Valid assigned attorney ID is required'), 
  validateRequest 
]; 
