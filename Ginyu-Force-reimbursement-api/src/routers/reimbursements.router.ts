/**
 * All requests to this router will come from /reimbursements
 */

import express from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import * as reimbursementDAO from '../daos/reimbursements.dao';

export const reimbursementsRouter = express.Router();

/**
 * This returns all reimbursements by their status. This may
 * be accessed by 'Captain', 'Sub Captain'.
 *
 * /reimbursements/status/:statudId
 */
reimbursementsRouter.get('/status/:statusId', [authMiddleware('Captain', 'Sup Captain'),
async (req, res) => {
    const reimbursementId = req.params.statusId;
    if (!reimbursementId) {
        res.sendStatus(400);
    } else {
        const reimbursements = await reimbursementDAO.findByReimbursementStatus(reimbursementId);
        res.json(reimbursements);
    }
}]);

/**
 * This returns all reimbursements by a single user. This may
 * be accessed by 'Captain', 'Sub Captain', or if
 * the user ID matches the reimbursement user ID. It should be
 *
 */


reimbursementsRouter.get('/author/userId/:id', [authMiddleware('Captain', 'Sup Captain', 'Grunt'),
async (req, res) => {
    const currentUser = req.session.user;
    if (currentUser && (currentUser.userId === +req.params.id || currentUser.role.role === 'Captain' || currentUser.role.role === 'Sub Captain')) {
        const users = await reimbursementDAO.findByUserID(req.params.id);
        res.json(users);
    } else {
        res.status(400);
        res.send('You can only access your own information.');
    }
}]);

/**
 * This allows a user to create a reimbursement. It will return
 * a status code of 201 CREATED if successful. ReimbursementID
 */
reimbursementsRouter.post('', [authMiddleware('Captain', 'Sup Captain', 'Grunt'),
async (req, res) => {
    const reimbursement = req.body;
    if (!reimbursement) {
        res.sendStatus(400);
    } else {
        const user = req.session.user;
        reimbursement.author.userId = user.userId;
        const result = await reimbursementDAO.createReimbursement(reimbursement);
        res.status(201);
        res.json(result);
    }
}]);

/**
 * This allows a Captain or Sub Captain to update the
 * status of the reimbursement. ReimbursementID must be the same
 */
reimbursementsRouter.patch('', [authMiddleware('Captain', 'Sup Captain'),
async (req, res) => {
    const reimbursement = req.body;
    if (!reimbursement) {
        res.sendStatus(400);
    } else {
        const user = req.session.user;
        reimbursement.resolver.userId = user.userId;
        const result = await reimbursementDAO.patchReimbursement(reimbursement);
        res.json(result);
    }
}]);

/**
 * Findall reimbursement
 * works don't have role or status yet
 */

reimbursementsRouter.get('', [ authMiddleware('Captain', 'Sup Captain'),
async (req, res) => {
        const result = await reimbursementDAO.findAll();
            res.json(result);
          } ]);
