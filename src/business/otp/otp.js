import CommonMethod from "../../common/method.js";
import { database } from "../../database/postgresql.js";

async function send(_email) {
    try {
        const email = _email.toLowerCase();
        const otp = CommonMethod.generateRandomString(10);
        let insertQuery = `
            UPDATE otp
            SET code = $1, last_update = current_time
            WHERE email = $2
        `;
        const cnt = await database.query(
            'SELECT * FROM otp where email = $1',
            [email]
        );
        if(cnt.rowCount == 0) {
            insertQuery = `
            INSERT INTO otp (code, email, last_update)
             VALUES ($1, $2, current_time)
            `;
            
        }
        const result = await database.query(insertQuery,[otp, email]);
        const msg = 'Mã xác nhận của bạn là ' + otp + '. Mã xác nhận có hiệu lực trong 30 phút!'
        await CommonMethod.sendEmail(email, "Mã xác nhận", msg);
        return true;
    } catch (error) {
        throw error
    }
}

async function verify(code, email) {
    try {
        const query = `
            SELECT *
            FROM otp
            WHERE code = $1 AND email = $2
        `;
        const result = await database.query(query,
            [code, email]
        );
        if(result.rowCount == 0) {
            throw Error("Invalid code")
        }
        const lastUpdateString = result.rows[0].last_update;
        // Parse lastUpdate time
        const lastUpdateParts = lastUpdateString.split(':');
        const lastUpdate = new Date();
        
        lastUpdate.setUTCHours(parseInt(lastUpdateParts[0], 10));
        lastUpdate.setUTCMinutes(parseInt(lastUpdateParts[1], 10));
        lastUpdate.setUTCSeconds(parseFloat(lastUpdateParts[2]));
        // Calculate 30 minutes ago
        const currentTime = new Date();
        const thirtyMinutesAgo = new Date(currentTime - 30 * 60 * 1000);
        if (lastUpdate < thirtyMinutesAgo) {
            throw Error("Expired code")
        } 
        return true;
    } catch (error) {
        throw error
    }
}

const OTPBusiness = {
    send,
    verify,
}

export default OTPBusiness