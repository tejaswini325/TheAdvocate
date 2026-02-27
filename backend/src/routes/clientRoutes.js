const express = require('express'); 
const router = express.Router(); 
const clientController = require('../controllers/clientController'); 
const { protect, authorize } = require('../middleware/authMiddleware'); 
 
router.use(protect); 
 
router.get('/search/:query', clientController.searchClients);

router.route('/') 
  .get(clientController.getAllClients) 
  .post(authorize('Admin'), clientController.createClient); 
 
router.route('/:id') 
  .get(clientController.getClient) 
  .put(authorize('Admin'), clientController.updateClient) 
  .delete(authorize('Admin'), clientController.deleteClient); 
 
module.exports = router; 
