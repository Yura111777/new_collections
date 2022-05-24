const Task = require('./../models/TaskModel');
const factory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync')


exports.setUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.isDone = catchAsync(async (req, res, next) => {
  await Task.findByIdAndUpdate(req.params.id, { isDone: true });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getAllTasks = factory.getAll(Task);
exports.getTask = factory.getOne(Task);
exports.createTask = factory.createOne(Task);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);
