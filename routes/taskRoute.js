const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('./../controllers/authController');

const router = new express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('user' ),
    taskController.setUserIds,
    taskController.createTask
  )
  .get(taskController.getAllTasks);

router.delete('/isDone/:id', taskController.isDone);

router
  .route('/:id')
  .get(taskController.getTask)
  .delete(
    authController.restrictTo('user'),
    taskController.deleteTask
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    taskController.updateTask
  );

module.exports = router;
