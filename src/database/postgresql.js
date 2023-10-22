import pkg from 'pg';
const { Pool } = pkg;

export const database = new Pool({
  user: "admin",
  host:  "dpg-ckqigau2eoec73adrdj0-a.singapore-postgres.render.com",
  database:  "mtt2023_t5s2",
  password:  "98d3mUgTbA5fN0IB54LpGxMxoyVmdA4E",
  port: 5432, 
  ssl: {
    rejectUnauthorized: false 
  }
});

export async function connectDB() {
  database.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database: ', err));

}

export async function testDB() {
  const result = await database.query('SELECT * FROM public.user');
  console.log("result: ", result.rows)
}


