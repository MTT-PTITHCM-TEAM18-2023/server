import { database } from "../../src/database/postgresql.js"

export async function testDB() {
    const result = await database.query('SELECT * FROM role');
    console.log("result: ", result.rows)
}