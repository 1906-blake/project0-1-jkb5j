/**
 * DAO with sql access to the res database.
 */
import { PoolClient } from 'pg';
import { connectionPool } from '../utli/connection.util';
import { convertSQLUser } from '../utli/sql.converter.util';
import { authMiddleware } from '../middleware/auth.middleware';
import User from '../models/user.model';

export async function findUserByUserPass(username: string, password: string) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        SELECT *
        FROM res_user z
        FULL JOIN role r
        ON (z.role = r.role_id)
        WHERE username = $1
        AND password = $2`;
        const result = await client.query(queryString, [username, password]);
        const sqlUser = result.rows[0];
        return sqlUser && convertSQLUser(sqlUser);
    } catch (err) {
        console.log(err);
        // return undefined;
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function findAllUsers() {
    authMiddleware('Captain', 'Sub Captain');
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        SELECT *
        FROM res_user`;
        const result = await client.query(queryString);
        const sqlUser = result.rows;
        return sqlUser && sqlUser.map(convertSQLUser);
    } catch (err) {
        console.log(err);
     return undefined;
    } finally {
        client && client.release();
    }
}


export async function findById(id: number) {
    authMiddleware('Captain', 'Sub Captain', 'Grunt');
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        SELECT *
        FROM res_user z
        FULL JOIN role r
        ON (z.role = r.role_id)
        WHERE user_id = $1`;
        const result = await client.query(queryString, [id]);
        const sqlUser = result.rows[0];
        return sqlUser && convertSQLUser(sqlUser);
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
    // return undefined;
}

// creat new users.
export async function createUser(user: User) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        INSERT INTO res_user (username, password, firstName, lastName, email, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING user_id`;
        const params = [user.username, user.password, user.firstName, user.lastName, user.email, user.role];
        const result = await client.query(queryString, params);
        return result.rows[0].user_id;
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
}

// update user query isn't working corretly yet
// og funtion name: export async function patchUser(user: User, idNum: number)
export async function patchUser(user: User) {
    const oldUser = await findById(user.userId);
    if (!oldUser) {
        return undefined;
    }
    user = {
        ...oldUser,
        ...user
    };
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        // This query uses a CTE to make two queries into one.
        const queryString = `
            WITH updated_user AS(
                UPDATE res_user SET username = $1, password = $2, firstName = $3, lastName = $4, email = $5, role = $6
                WHERE user_id = $7
                RETURNING *
                )
            SELECT *
            FROM updated_user u
            FULL JOIN role r
            ON (u.role = r.role_id)
            WHERE user_id = $7
        `;
        const params = [user.username, user.password, user.firstName, user.lastName, user.email, user.role.roleId, user.userId];
        const result = await client.query(queryString, params);
        const sqlUser = result.rows[0];
        return convertSQLUser(sqlUser);
    } catch (err) {
        console.log(err);
        // return undefined;
    } finally {
        client && client.release();
    }
    return undefined;
}