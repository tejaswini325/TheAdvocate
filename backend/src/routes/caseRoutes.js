const express = require('express'); 
const router = express.Router(); 
const caseController = require('../controllers/caseController'); 
const { protect, authorize } = require('../middleware/authMiddleware'); 
 
router.use(protect); 
 
router.get('/search/:query', caseController.searchCases);
router.get('/client/:clientId', caseController.getCasesByClient);

router.route('/') 
  .get(caseController.getAllCases) 
  .post(caseController.createCase); 
 
router.route('/:id') 
  .get(caseController.getCase) 
  .put(caseController.updateCase) 
  .delete(authorize('Admin'), caseController.deleteCase); 
 
module.exports = router; 
