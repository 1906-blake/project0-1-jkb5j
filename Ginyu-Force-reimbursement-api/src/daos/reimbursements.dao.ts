/**
 * This DAO provides sql access to the res database,
 * reimbursements.
 */
import Reimbursement from '../models/reimbursement.model';
import { PoolClient } from 'pg';
import { connectionPool } from '../utli/connection.util';
import { convertSQLReimbursement } from '../utli/convert.reimbursement.util';
import { authMiddleware } from '../middleware/auth.middleware';
// import User from '../models/user.model';

// not working yet
export async function createReimbursement(reimbursement: Reimbursement) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `INSERT INTO reimbursement(author,amount,dateSubmitted,description,status,type)
        VALUES($1,$2,$3,$4,$5,$6)  RETURNING   reimbursement_id;`;
        const params = [reimbursement.author && reimbursement.author.userId, reimbursement.amount, reimbursement.dateSubmitted, reimbursement.description, reimbursement.status && reimbursement.status.statusId,
            reimbursement.type && reimbursement.type.typeId];
        const result = await client.query(queryString, params);
        console.log(result);
        const sqlReimbursement = result.rows[0];
        return convertSQLReimbursement(sqlReimbursement);
    } catch (err) {
        console.log(err);
        // return undefined;
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function findByReimbursementStatus(status: string) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        select reimbursement.*, a.username as author_username, a.firstname as author_firstname,
        a.lastname as author_lastname, a.email as author_email, a.role as author_role_id,
        ar.role_name as author_role, r.username as resolver_username, r.firstname as resolver_firstname,
        r.lastname as resolver_lastname, r.email as resolver_email, r.role as resolver_role_id,
        rr.role_name as resolver_role, reimbursement_status.status as status_name, reimbursement_type.type as type_name from reimbursement
        left join res_user as a on reimbursement.author = a.user_id
        left join role as ar on a.role = ar.role_id
        left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
        left join res_user as r on reimbursement.resolver = r.user_id
        left join role as rr on r.role = rr.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id
		 WHERE reimbursement.status = $1;`;
        const result = await client.query(queryString, [status]);
        const sqlReimbursement = result.rows;
        return sqlReimbursement && sqlReimbursement.map(convertSQLReimbursement);
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
}


export async function findByUserID(id: number) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `select reimbursement.*, a.username as author_username, a.firstname as author_firstname,
        a.lastname as author_lastname, a.email as author_email, a.role as author_role_id,
        ar.role_name as author_role, r.username as resolver_username, r.firstname as resolver_firstname,
        r.lastname as resolver_lastname, r.email as resolver_email, r.role as resolver_role_id,
        rr.role_name as resolver_role, reimbursement_status.status as status_name, reimbursement_type.type as type_name from reimbursement
        left join res_user as a on reimbursement.author = a.user_id
        left join role as ar on a.role = ar.role_id
        left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
        left join res_user as r on reimbursement.resolver = r.user_id
        left join role as rr on r.role = rr.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id
		 WHERE author = $1;
        `;
        const result = await client.query(queryString, [id]);
        const sqlReimbursement = result.rows;
        return sqlReimbursement && sqlReimbursement.map(convertSQLReimbursement);
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
}

export async function findByReimbursementID(id: number) {
    console.log(id);
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        select reimbursement.*, a.username as author_username, a.firstname as author_firstname,
        a.lastname as author_lastname, a.email as author_email, a.role as author_role_id,
        ar.role_name as author_role, r.username as resolver_username, r.firstname as resolver_firstname,
        r.lastname as resolver_lastname, r.email as resolver_email, r.role as resolver_role_id,
        rr.role_name as resolver_role, reimbursement_status.status as status_name, reimbursement_type.type as type_name from reimbursement
        left join res_user as a on reimbursement.author = a.user_id
        left join role as ar on a.role = ar.role_id
        left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
        left join res_user as r on reimbursement.resolver = r.user_id
        left join role as rr on r.role = rr.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id
		 WHERE reimbursement_id =$1;
        `;
        const result = await client.query(queryString, [id]);
        const sqlReimbursement = result.rows[0];
        console.log('getbyreim ID', sqlReimbursement);
        return convertSQLReimbursement(sqlReimbursement);
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
}


export async function patchReimbursement(newReimbursement: Partial<Reimbursement>) {
    const oldReimbursement = await findByReimbursementID(newReimbursement.reimbursementId);
    console.log('oldreimbursement', oldReimbursement);
    if (!oldReimbursement) {
        return undefined;
    }
    console.log('newReimburse', newReimbursement);
    const reimbursement = {
        ...oldReimbursement,
        ...newReimbursement
    };
    console.log(reimbursement);
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
        UPDATE reimbursement SET author = $1, amount = $2, datesubmitted = $3, dateresolved = $4,
            description = $5, resolver = $6, status = $7, type = $8
             WHERE reimbursement_id = $9
             RETURNING *;
                `;
        const params = [reimbursement.author && reimbursement.author.userId, reimbursement.amount, reimbursement.dateSubmitted,
        reimbursement.dateResolved, reimbursement.description, reimbursement.resolver && reimbursement.resolver.userId,
        reimbursement.status && reimbursement.status.statusId, reimbursement.type && reimbursement.type.typeId, reimbursement.reimbursementId];
        const result = await client.query(queryString, params);
        const sqlReimbursement = result.rows[0];
        return convertSQLReimbursement(sqlReimbursement);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}

// not getting author id yet
export async function findAll() {
    console.log('finding all reimbursements');
    authMiddleware('Captain', 'Sub Captain');
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `select reimbursement.*, a.username as author_username, a.firstname as author_firstname,
        a.lastname as author_lastname, a.email as author_email, a.role as author_role_id,
        ar.role_name as author_role, r.username as resolver_username, r.firstname as resolver_firstname,
        r.lastname as resolver_lastname, r.email as resolver_email, r.role as resolver_role_id,
        rr.role_name as resolver_role, reimbursement_status.status as status_name, reimbursement_type.type as type_name from reimbursement
        left join res_user as a on reimbursement.author = a.user_id
        left join role as ar on a.role = ar.role_id
        left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
        left join res_user as r on reimbursement.resolver = r.user_id
        left join role as rr on r.role = rr.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id`;
        const result = await client.query(queryString);
        // const sqlReimbursement = result.rows[0];
        const sqlReimbursement = result.rows;
        return sqlReimbursement && sqlReimbursement.map(convertSQLReimbursement);
        // return convertSQLReimbursement(sqlReimbursement);
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
    console.log('found all');
    // return undefined;
}

// select reimbursement_id, reimbursement.author, firstName, lastName,role_name,amount,dateSubmitted,dateResolved,description,resolver,
// 		reimbursement.status,reimbursement_status.status,reimbursement.type,reimbursement_type.type
//         from reimbursement left join res_user on reimbursement.author = res_user.user_id
// 		left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
// 		left join role on res_user.role = role.role_id


// og reimbursement patch update sql
// const queryString = `
// UPDATE reimbursement
// SET  amount=$1,dateResolved=$2,resolver=$3, status=$4, type=$5
// where  reimbursement_id=$6;`;
// const params = [reimbursement.amount, reimbursement.dateResolved, reimbursement.resolver.userId, reimbursement.status, reimbursement.type, reimbursement.reimbursementId];

// edited versinon 1
// UPDATE reimbursement SET author = $1, amount = $2, datesubmitted = $3, dateresolved = $4,
//     description = $5, resolver = $6, status = $7, type = $8
//     WHERE reimbursement_id = $9     RETURNING *
// `;
//  const params = [reimbursement.author && reimbursement.author.userId, reimbursement.amount, reimbursement.dateSubmitted, 
//  reimbursement.dateResolved, reimbursement.description, reimbursement.resolver && reimbursement.resolver.user_id, 
//  reimbursement.status && reimbursement.status.status_id, reimbursement.type && reimbursement.type.type_id, reimbursement.reimbursement_id];