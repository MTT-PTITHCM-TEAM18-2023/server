import {database} from "../../database/postgresql.js";
import {UserDTO} from "./dto.js";

const login = async (_email, password) => {
  try {
    const email = _email.toLowerCase();
    const query = {
        text: 'SELECT * FROM public.user WHERE email = $1 AND password = $2 AND is_active = true',
        values: [email, password]
    };
    const result = await database.query(query)
    if (result.rowCount === 0) {
        return null
    }

    return new UserDTO(result.rows[0]);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

const getProfile = async (email) => {
  try {
    const query = {
        text: 'SELECT * FROM public.user WHERE email = $1 AND is_active = true',
        values: [email]
    };
    const result = await database.query(query)
    if (result.rowCount === 0) {
        return null
    }
    return new UserDTO(result.rows[0]);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

const changePassword = async (email, newPassword) => {
  try {
    const query = {
        text: 
        `UPDATE public.user SET password = $1 WHERE email = $2 AND is_active = true
        RETURNING *;`,
        values: [newPassword, email]
    };
    const result = await database.query(query)
    if (result.rowCount === 0) {
        return null
    }
    return result.rows;
  } catch (error) {
      console.error('Error executing query:', error);
      throw error;
  }
}

const get = async (_page, _limit) => {
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;

    const offset = (page - 1) * limit;

    try {
        const all = await database.query(
            'SELECT * FROM public.user'
        )
        const result = await database.query(
            'SELECT * FROM public.user ORDER BY id OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        return {
            items: result.rows.map(item => new UserDTO(item)),
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
            'SELECT * FROM public.user WHERE id = $1',
            [id]
        )
        return new UserDTO(rows[0])
    } catch (e) {
        console.log(e)
        return null
    }
}

const create = async ({name, email, password, phone, address, baseSalary, roleId}) => {
    try {
        await database.query(
            'INSERT INTO public.user (name, email, password, phone, address, base_salary, role_id, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, true)',
            [name, email, password, phone, address, baseSalary, roleId]
        )
        return true
    }
    catch (e) {
        console.log(e.message)
        return false
    }
}

const update = async (email, {name, phone, address, baseSalary, roleId}) => {
    try {
        await database.query(
            'UPDATE public.user SET name = $1, phone = $2, address = $3, base_salary = $4, role_id = $5 WHERE email = $6 and is_active = true',
            [name, phone, address, baseSalary, roleId, email]
        )
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

const deleteById = async (id) => {
    try {
        await database.query(
            'UPDATE public.user SET is_active = false WHERE id = $1',
            [id]
        )
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

const UserBusiness = {
    login,
    changePassword,
    getProfile,
    get,
    getById,
    create,
    update,
    deleteById
}

export default UserBusiness