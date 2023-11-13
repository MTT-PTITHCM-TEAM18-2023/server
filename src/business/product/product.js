import { database } from "../../database/postgresql.js";
import { ProductDTO } from "./dto.js";

const get = async (_page, _limit) => {
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
  
    const offset = (page - 1) * limit;
  
    try {
        const all = await database.query(
            'SELECT * FROM product where is_active = true'
        )
        const result = await database.query(
            'SELECT * FROM product where is_active = true ORDER BY id desc OFFSET $1 LIMIT $2',
            [offset, limit]
        );

        return {
            items: result.rows.map(item => new ProductDTO(item)),
            meta: {
                "itemCount": result.rowCount,
                "totalItems": all.rowCount,
                "itemsPerPage": limit,
                "totalPages": parseInt(all.rowCount/limit) + 1,
                "currentPage": page
            },

      } 
      
    } catch (error) {
        console.error('Error executing query:', error);
        return null
    }
}


const findByText = async (_page, _limit, text) => {
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
  
    const offset = (page - 1) * limit;
  
    try {
        const all = await database.query(
            'SELECT * FROM product where is_active = true AND (name LIKE $1 OR description LIKE $1)',
            ['%' + text + '%']
        )
        const result = await database.query(
            'SELECT * FROM product where is_active = true AND (name LIKE $3 OR description LIKE $3) ORDER BY id OFFSET $1 LIMIT $2',
            [offset, limit, '%' + text + '%']
        );

        return {
            items: result.rows.map(item => new ProductDTO(item)),
            meta: {
                "itemCount": result.rowCount,
                "totalItems": all.rowCount,
                "itemsPerPage": limit,
                "totalPages": parseInt(all.rowCount/limit) + 1,
                "currentPage": page
            },

      } 
      
    } catch (error) {
        console.error('Error executing query:', error);
        return null
    }
}

const getById = async (id) => {
    try {
        const {rows} = await database.query(
            'SELECT * FROM product WHERE id = $1', [id]
        )

        return new ProductDTO(rows[0])
    } catch (e) {
        console.log("error: ", e)
        return null
    }
}

const create = async ({name, description, price, imageUrl, categoryId, supplierId, unit, qty}) => {
    try {
        await database.query(
            'INSERT INTO public.product (name, description, price, image_url, category_id, supplier_id, unit, qty, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)',
            [name, description, price, imageUrl, categoryId, supplierId, unit, qty]
        )
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

const update = async (id, {name, description, price, imageUrl, categoryId, supplierId, unit, qty, isActive}) => {
    console.log("id: ", id)
    console.log("name: ", name)
    console.log("description: ", description)
    console.log("price: ", price)
    console.log("imageUrl: ", imageUrl)
    console.log("categoryId: ", categoryId)
    console.log("supplierId: ", supplierId)
    console.log("unit: ", unit)
    console.log("qty: ", qty)
    console.log("isActive: ", isActive)
    try {
        await database.query(
            'UPDATE product SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5, supplier_id = $6, unit = $7, qty = $8, is_active = $9 WHERE id = $10',
            [name, description, price, imageUrl, categoryId, supplierId, unit, qty, isActive, id]
        )
        return true
    } catch (e) {
        console.log("error: ", e)
        return false
    }
}

const deleteById = async (id) => {
    try {
        await database.query(
            'UPDATE product SET is_active = false WHERE id = $1', [id]
        )
        return true
    } catch (e) {
        console.log("error: ", e)
        return false
    }
}

const getByCat = async (id, _page, _limit) => {
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
  
    const offset = (page - 1) * limit;
    try {
        const all = await database.query(
            'SELECT * FROM product where is_active = true AND category_id = $1',
            [id]
        )
        const result = await database.query(
            'SELECT * FROM product where is_active = true AND category_id = $1 ORDER BY id OFFSET $2 LIMIT $3',
            [id, offset, limit]
        );

        return {
            items: result.rows.map(item => new ProductDTO(item)),
            meta: {
                "itemCount": result.rowCount,
                "totalItems": all.rowCount,
                "itemsPerPage": limit,
                "totalPages": parseInt(all.rowCount/limit) + 1,
                "currentPage": page
            },

      } 
      
    } catch (error) {
        console.error('Error executing query:', error);
        return null
    }
}

const findByName = async (name) => {
    try {
        const all = await database.query(
            `
            SELECT p.*
            FROM product p
            LEFT JOIN category c ON p.category_id = c.id
            WHERE p.name LIKE '%' || $1 || '%' OR c.name LIKE '%' || $1 || '%'
            `,
            [name]
        )
        return all.rows
    } catch (error) {
        console.error('Error executing query:', error);
        return null
    }
}

const ProductBusiness = {
    get,
    getById,
    create,
    update,
    deleteById,
    getByCat,
    findByName,
    findByText
}

export default ProductBusiness