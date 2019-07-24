// import Reimbursement from '../models/reimbursement.model';
// import User from '../models/user.model';
// import ReimbursementStatus from '../models/reimbursement.status';
// import ReimbursementType from '../models/reimbursement.type';

import Reimbursement from '../models/reimbursement.model';
import User from '../models/user.model';
import ReimbursementStatus from '../models/reimbursement.status';
import ReimbursementType from '../models/reimbursement.type';
 import Role from '../models/role.model';

// const userRole = req.session.user.role;

export function convertSQLReimbursement(row: any) {
    const reimbursement = new Reimbursement(row.reimbursement_id,
        // new User(row.author_id, ' ', ' ', ' ', ' ', ' ', undefined ),  // works but doesn't show all info the ones with ' '
        new User(row.author_id,
            ' ',
            ' ',
            row.firstname,
            row.lastname,
            row.email,
            new Role(row.role_id, row.role_name)),
        row.amount,
        row.date_submitted,
        row.date_resolved,
        row.description,
        // new User(row.resolver, '', '', '', '', '', undefined),
         new User(row.author_id,
            ' ',
            ' ',
            row.firstname,
            row.lastname,
            row.email,
            new Role(row.role_id, row.role_name)),
         new ReimbursementStatus(row.status_id, row.statu_name),
        // new ReimbursementStatus(row.status_id, ' '),
        // new ReimbursementType(row.type_id, ' '));
         new ReimbursementType(row.type_id, row.type));

    return reimbursement;
}
