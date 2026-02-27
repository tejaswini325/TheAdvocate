const express = require('express'); 
const router = express.Router(); 
const taskController = require('../controllers/taskController'); 
const { protect } = require('../middleware/authMiddleware'); 
 
router.use(protect); 
 
router.get('/case/:caseId', taskController.getTasksByCase);

router.route('/') 
  .get(taskController.getAllTasks) 
  .post(taskController.createTask); 
 
router.route('/:id') 
  .get(taskController.getTask) 
  .put(taskController.updateTask) 
  .delete(taskController.deleteTask); 
 
module.exports = router; 
