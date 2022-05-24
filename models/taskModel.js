const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Cannot be empty.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Task must have an user']
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Priority can\'t be blank from 1 max 5']
    },
    isDone: {
          type: Boolean,
          default: false,
          select: false
      },
    description:{
      type: String,
      required: [true, 'Description can\'t be blank']
    },
    dueDate: {
        type: Date,
        required: [true, 'dueDate can\'t be blank'],
        default: Date.now(),

    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);



taskSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  });

  next();
});



taskSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});



const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
