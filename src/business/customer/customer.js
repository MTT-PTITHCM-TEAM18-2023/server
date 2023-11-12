import { database } from "../../database/postgresql.js";


async function get(_page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const all = await database.query(
            'SELECT * FROM customer'
        )
        if(all.rowCount == 0) {
            throw Error("Not found customer")
        }
        const result = await database.query(
            'SELECT * FROM customer ORDER BY id desc OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found customer")
        }
        return {
            items: result.rows,
            meta: {
                "itemCount": result.rowCount,
                "totalItems": all.rowCount,
                "itemsPerPage": limit,
                "totalPages": parseInt(all.rowCount/limit) + 1,
                "currentPage": page
            },
      } 
    } catch (error) {
        throw error
    }
}

async function getLoyal(_page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const all = await database.query(
            'SELECT * FROM customer where is_loyal = true'
        )
        if(all.rowCount == 0) {
            throw Error("Not found loyal customer")
        }
        const result = await database.query(
            'SELECT * FROM customer where is_loyal = true ORDER BY id desc OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found loyal customer")
        }
        return {
            items: result.rows,
            meta: {
                "itemCount": result.rowCount,
                "totalItems": all.rowCount,
                "itemsPerPage": limit,
                "totalPages": parseInt(all.rowCount/limit) + 1,
                "currentPage": page
            },
      } 
    } catch (error) {
        throw error
    }
}

async function getById(id){
    try {
        const result = await database.query(
            'SELECT * FROM customer where id = $1',
            [id]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found customer");
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

async function create(customer){
    try {
        const result = await database.query(
            `
                INSERT INTO customer (name, phone, email, address, is_loyal) 
                VALUES ($1, $2, $3, $4, false) 
                RETURNING *;
            `,
            [customer.name, customer.phone, customer.email, customer.address]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found customer");
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

async function update(customer){

    try {
        const result = await database.query(
            `
                UPDATE customer SET 
                    name = $2, 
                    phone = $3,
                    email = $4,
                    address = $5,
                WHERE id = $1
                RETURNING *;
            `,
            [customer.id, customer.name, customer.phone, customer.email, customer.address]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found customer: id " + customer.id);
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

const CustomerBusiness = {
    get,
    getById,
    getLoyal,
    create,
    update,
}

export default CustomerBusiness