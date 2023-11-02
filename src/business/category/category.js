import { database } from "../../database/postgresql.js";


export async function getCategory(_page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const all = await database.query(
            'SELECT * FROM category'
        )
        if(all.rowCount == 0) {
            throw Error("Not found category")
        }
        const result = await database.query(
            'SELECT * FROM category ORDER BY id OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found category")
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

export async function getCategoryById(id){
    try {
        const result = await database.query(
            'SELECT * FROM category where id = $1',
            [id]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found category");
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

export async function createCategory(category){
    try {
        const result = await database.query(
            `
                INSERT INTO category (name) 
                VALUES ($1) 
                RETURNING *;
            `,
            [category.name]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found category");
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

export async function updateCategory(category){

    try {
        const result = await database.query(
            `
                UPDATE category SET 
                    name = $2 
                WHERE id = $1
                RETURNING *;
            `,
            [category.id, category.name]
        );
        if (result.rowCount == 0) {
            throw new Error("Not found category: id " + category.id);
        }
        return result.rows[0]
    } catch (error) {
        throw error
    }
}