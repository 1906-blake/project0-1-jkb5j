import { Pool } from 'pg';

const connectionConfiguration = {
    user: process.env.REIMBURSEMENT_DB_USERNAME || 'postgres',
    host: process.env.REIMBURSEMENT_DB_URL || 'localhost',
    database: process.env.REIMBURSEMENT_DB_NAME || 'reimbursement_api',
    password: process.env.REIMBURSEMENT_DB_PASSWORD || 'Freefood8',
    port: +process.env.REIMBURSEMENT_DB_PORT || 5432,
    max: 5
};

export const connectionPool = new Pool(connectionConfiguration);