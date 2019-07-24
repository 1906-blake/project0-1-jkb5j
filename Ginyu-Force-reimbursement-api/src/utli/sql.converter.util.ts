/**
 * This converts a SQL user object to a JS user object
 * forformating purposes.
 */

import User from '../models/user.model';
import Role from '../models/role.model';

export function convertSQLUser(row: any) {
    const user = new User(row.user_id,
                    row.username,
                    row.password,
                    row.firstname,
                    row.lastname,
                    row.email,
                    new Role(row.role_id, row.role_name));
        // console.log(user);
        return user;
}
