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
        new User(row.author,
            row.author_username,
            '',
            row.author_firstname,
            row.author_lastname,
            row.author_email,
            new Role(row.author_role_id, row.author_role_name)),
        row.amount,
        // row.date_submitted,
        row.datesubmitted,
        // row.date_resolved,
        row.dateresolved,
        row.description,
        // new User(row.resolver, '', '', '', '', '', undefined),
        new User(row.resolver,
            row.resolver_username,
            '',
            row.resolver_firstname,
            row.resolver_lastname,
            row.resolver_email,
            new Role(row.resolver_role_id, row.resolver_role_name)),
        // new ReimbursementStatus(row.status_id, row.status_name),
        new ReimbursementStatus(row.status, row.status_name),
        // new ReimbursementType(row.type_id, ' '));
        new ReimbursementType(row.type, row.type_name));
    console.log(row.datesubmitted);
    console.log(row.dateresolved);
    return reimbursement;
}
