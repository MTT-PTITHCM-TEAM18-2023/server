import pkg from 'pg';
const { Pool } = pkg;

export const database = new Pool({
  user: "admin",
  host:  "dpg-cjb4r5pitvpc73ekc0b0-a.singapore-postgres.render.com",
  database:  "hoainhan_m6h5",
  password:  "NSP0G2rDxpjNWkkNLdvqfmKxBFJeSKcV",
  port: 5432, 
  ssl: {
    rejectUnauthorized: false 
  }
});

export async function connectDB() {
  database.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database', err));

}



