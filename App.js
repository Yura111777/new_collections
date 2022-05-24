const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoute');
const AppError = require("./utils/appError");

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(`Cant find this url ${req.originalUrl} on the server!`, 404)
    );
});

app.use(globalErrorHandler);
module.exports = app;