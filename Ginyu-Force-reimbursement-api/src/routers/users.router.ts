/**
 * All requests has url /users
 * This router works with the users data
 * res users.
 */

import express from 'express';
import * as usersDAO from '../daos/users.dao';
import { authMiddleware } from '../middleware/auth.middleware';
// import User from '../models/user.model';

export const usersRouter = express.Router();

/**
 * This endpoint returns all users on the system if the
 * current user has Captain level access. Sub Captian
 *  access returns all users that are not
 * Captains or Sub Captains.
 */
usersRouter.get('', [ authMiddleware('Captain', 'Sup Captain'),
                      async (req, res) => {
                              const users = await usersDAO.findAllUsers();
                                  res.json(users);
                                } ]);

/**
 * This endpoint returns a user by their ID. Only Captains Sub Captains
 * may access this, but gurts IDs must match the
 * ID or it won't return.
 * Done
 */

usersRouter.get('/:id', [authMiddleware('Captain', 'Sup Captain', 'Grunt'),
async (req, res) => {
    const currentUser = req.session.user;
    if (currentUser && (currentUser.userId === +req.params.id || currentUser.role.role === 'Captain' || currentUser.role.role === 'Sub Captain')) {
        const users = await usersDAO.findById(req.params.id);
        res.json(users);
    } else {
        res.status(400);
        res.send('You can only access your own information.');
    }
}]);


/**
 * This endpoint updates a user. Captain are the
 * only ones who may access this endpoint.
 */
// usersRouter.patch('/:id', (req, res) => {
   usersRouter.patch('', [authMiddleware('Captain'),
  // added ([ in front of async
   async (req, res) => {
      const userToUpdate = req.body;
      console.log(userToUpdate);
      // const updatedUser = await usersDAO.patchUser(userToUpdate, req.params.id);
      const updatedUser = await usersDAO.patchUser(userToUpdate);
      // console.log(updatedUser);
      if (!updatedUser) {
          res.status(400);
          res.send('That user id does not exist.');
      } else {
          res.send(updatedUser);
      }
  }]);
// });

/**
 * This endpoint creates a new user.Captain are
 * the only ones with access to this endpoint.
 */
usersRouter.post('', [authMiddleware('Captain'),
async (req, res) => {
    const user = req.body;
    if (!user) {
        res.sendStatus(400);
    } else {
        const newUser = await usersDAO.createUser(user);
        if (!newUser) {
            res.sendStatus(400);
        } else {
            newUser;
            res.status(201); // created status code
            res.json(newUser);
        }
    }
}]);