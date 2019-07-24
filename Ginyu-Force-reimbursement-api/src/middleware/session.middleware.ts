/**
 * Session middleware cofiguration. This handles the session
 * information for us. As the session may contain sensitive
 * information (passwords), it should be a secure cookie.
 */

import session from 'express-session';

const sessionConfiguration = {
    secret: 'dbz.frizza',
    // cookie: { secure: true }
    cookie: { secure: false }
};

export const sessionMiddleware = session(sessionConfiguration);