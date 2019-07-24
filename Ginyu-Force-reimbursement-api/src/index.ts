import express from 'express';
import bodyParser from 'body-parser';
import { usersRouter } from './routers/users.router';
import { reimbursementsRouter } from './routers/reimbursements.router';
import { sessionMiddleware } from './middleware/session.middleware';
import { authRouter } from './routers/auth.router';

// specify the port will run on
const port = 8012;
const app = express();

/**
 * Logging middleware
 * This callback will be invoked anytime a request is made
 * regardless of url or http method
 */
app.use((req, res, next) => {
    console.log(`request made with url: ${req.url} and method ${req.method}`);
    next();
});

/**
 * Bodyparser to convert html request body to JSON for usage
 * in the routers.
 */
app.use(bodyParser.json());

/**
 * Session Control middleware
 */
app.use(sessionMiddleware);

/**
 * Router Registry
 */
app.use('/users', usersRouter);
app.use('/reimbursements', reimbursementsRouter);
app.use(authRouter);

/**
 * Logging confirmation that server is running.
 */
app.listen(port, () => {
    console.log('app started on port: ' + port);
});