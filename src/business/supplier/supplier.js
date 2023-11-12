import { database } from "../../database/postgresql.js";


async function get(_page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const all = await database.query(
            'SELECT * FROM supplier'
        )
        if(all.rowCount == 0) {
            throw Error("Not found supplier")
        }
        const result = await database.query(
            'SELECT * FROM supplier ORDER BY id OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found supplier")
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
            'SELECT * FROM supplier where id = $1',
            [id]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found supplier");
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

async function create(supplier){
    try {
        const result = await database.query(
            `
                INSERT INTO supplier (name, phone, email, address, is_active) 
                VALUES ($1, $2, $3, $4, true) 
                RETURNING *;
            `,
            [supplier.name, supplier.phone, supplier.email, supplier.address]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found supplier");
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

async function update(supplier){

    try {
        const result = await database.query(
            `
                UPDATE Supplier SET 
                    name = $2, 
                    phone = $3,
                    email = $4,
                    address = $5,
                WHERE id = $1
                RETURNING *;
            `,
            [supplier.id, supplier.name, supplier.phone, supplier.email, supplier.address]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found supplier: id " + supplier.id);
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}


const SupplierBusiness = {
    get,
    getById,
    create,
    update,
}

export default SupplierBusiness