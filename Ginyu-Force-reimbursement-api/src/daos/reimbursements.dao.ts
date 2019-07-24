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
        const queryString = `INSERT INTO reimbursement(author,amount,dateSubmitted,dateResolved,description,resolver,status,type)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)  RETURNING   reimbursement_id;`;
        const params = [reimbursement.author.userId, reimbursement.amount, reimbursement.dateSubmitted, reimbursement.dateResolved, reimbursement.description, reimbursement.resolver.userId, reimbursement.status, reimbursement.type];
        const result = await client.query(queryString, params);
        return convertSQLReimbursement(result.rows[0]);
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
        select * from reimbursement left join res_user on reimbursement.author = res_user.user_id
		left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
		left join role on res_user.role = role.role_id
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
        const queryString = `select * from reimbursement left join res_user on
         reimbursement.author = res_user.user_id
		    left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
		left join role on res_user.role = role.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id
		 WHERE resolver = $1;
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
        select * from reimbursement left join res_user on reimbursement.author = res_user.user_id
		left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
		left join role on res_user.role = role.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id
		 WHERE reimbursement_id =$1;
        `;
        const result = await client.query(queryString, [id]);
        const sqlReimbursement = result.rows;
        return convertSQLReimbursement(sqlReimbursement);
    } catch (err) {
        console.log(err);
        return undefined;
    } finally {
        client && client.release();
    }
}


export async function patchReimbursement(reimbursement: Reimbursement) {
    const oldReimbursement = await findByReimbursementID(reimbursement.reimbursementId);
    console.log(oldReimbursement);
    if (!oldReimbursement) {
        return undefined;
    }
    reimbursement = {
        ...oldReimbursement,
        ...reimbursement
    };
    console.log(reimbursement);
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
                UPDATE reimbursement
                SET  amount=$1,dateResolved=$2,resolver=$3, status=$4, type=$5
                where  reimbursement_id=$6;`;
        const params = [reimbursement.amount, reimbursement.dateResolved, reimbursement.resolver.userId, reimbursement.status, reimbursement.type, reimbursement.reimbursementId];
        console.log(params);
        const result = await client.query(queryString, params);
        const sqlReimbursement = result.rows;
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
        const queryString = `select reimbursement_id, reimbursement.author, firstName, lastName,role_name,amount,dateSubmitted,dateResolved,description,resolver,
		reimbursement.status,reimbursement_status.status,reimbursement.type,reimbursement_type.type
        from reimbursement left join res_user on reimbursement.author = res_user.user_id
		left join reimbursement_status on reimbursement.status=reimbursement_status.status_id
		left join role on res_user.role = role.role_id
		left join reimbursement_type on reimbursement.type=reimbursement_type.type_id; `;
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