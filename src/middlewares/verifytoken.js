import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {Status} from "../common/common.js";
import { database } from "../database/postgresql.js";
dotenv.config();


async function isTokenRevoked(token) {

    const query = `
        SELECT *
        FROM jwt
        WHERE token = $1;
    `;
    const res = await database.query(query,
        [token]
    );
    return res.rowCount === 0;

}

export function getJwt(req) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        return authHeader.split(" ")[1];
    }
    return null

}

export function decodeJwt(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        console.error('Error decoding JWT:', error.message);
        return null
    }
}

async function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const isRevoked = await isTokenRevoked(token);
        if (isRevoked) {
            return res.status(401).json("Invalid token!");

        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err)
                return res.status(403).json({
                    message: "Invalid token",
                    status: Status.INVALID,
                });
            req.user = data;
            next();
        });
    } else {
        return res.status(401).json("Unauthenticated!");
    }
}
const expiresIn = '1h';

export async function generateToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn})
    const query = `INSERT INTO jwt (token)VALUES ($1)`
    const j_res = await database.query(query,
        [token]
    );
    return token
}

export async function revokeToken(token) {
    try {
        const query = `
            DELETE
            FROM jwt
            WHERE token = $1;
        `;
        const result = await database.query(query,
            [token]
        );
        if (result.rowCount === 0) {
            return null
        }
        return true
    } catch (error) {
        throw error
    }

}

export {verifyToken};
