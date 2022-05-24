const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');



exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Create error if user Posts password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
        new AppError(
            'This route is not for password updates. Please use /updateMyPassword',
            400
        )
    );
  }

  //2) Filtered out unwanted field name that not allowed to be updated
  const filteredBody = filterObj(req.body, 'email', 'name');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  //2) Update user document
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});



exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not  defined! Please use /signup instead!'
  });
};

//Do not update password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
