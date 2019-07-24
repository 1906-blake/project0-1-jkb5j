import { connectionPool } from "./connection.util";
import { PoolClient } from "pg";



export async function findAllES8() {
    console.log('finding all users');
    let client: PoolClient;
    try {
        client = await connectionPool.connect(); // basically .then is everything after this
        const result = await client.query('SELECT * FROM res_user');
        console.log(result.rows);
    } catch (err) {
        console.log(err)
    } finally {
        client && client.release();
    }
    console.log('found all');
}

export async function findByUsernameAndPassword(username: string, password: string) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        
        // it is bad to use interpolation here because it allows sql injection
        // const queryString = `
        //     SELECT * FROM app_user 
        //         WHERE username = '${username}' AND pass = '${password}'
        // `;

        // instead there is a built in way of handling this to prevent sql injection
        const queryString = `
            SELECT * FROM app_user
                WHERE username = $1 AND pass = $2
        `
        const result = await client.query(queryString, [username, password]);
        console.log(result.rows[0]); // there should really only be 1 row at best
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }


}