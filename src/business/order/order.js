import { sendEmail } from "../../common/email.js";
import { database } from "../../database/postgresql.js";



async function getMapOrderType() {
    try {
        const all = await database.query(
            'SELECT * FROM order_type'
        )
        if (all.rowCount == 0) {
            return null
        }
        const m = new Map();
        for (const row of all.rows){
            m.set(row.id, row.type);
        }
        return m
    } catch (error) {
        return null
    }
}

async function getMapOrderStatus() {
    try {
        const all = await database.query(
            'SELECT * FROM order_status'
        )
        if (all.rowCount == 0) {
            return null
        }
        const m = new Map();
        for (const row of all.rows){
            m.set(row.id, row.name);
        }
        return m
    } catch (error) {
        return null
    }
}

async function getMapUser() {
    try {
        const all = await database.query(
            'SELECT * FROM public.user'
        )
        if (all.rowCount == 0) {
            return null
        }
        const m = new Map();
        for (const row of all.rows){
            m.set(row.id, {name: row.name, email: row.email});
            // m.set(row.id, row.name);
        }
        return m
    } catch (error) {
        return null
    }
}

async function getMapCustomer() {
    try {
        const all = await database.query(
            'SELECT * FROM customer'
        )
        if (all.rowCount == 0) {
            return null
        }
        const m = new Map();
        for (const row of all.rows){
            m.set(row.id, {name: row.name, email: row.email});
        }
        return m
    } catch (error) {
        return null
    }
}

export async function getPendingOrder(_page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const mType = await getMapOrderType()
        const mStatus = await getMapOrderStatus()
        const mUser = await getMapUser()
        const mCustomer = await getMapCustomer()
        const all = await database.query(
            'SELECT * FROM public.order where order_status_id = 1 OR order_status_id = 2 OR order_status_id = 3'
        )
        if(all.rowCount == 0) {
            throw Error("Not found order")
        }
        const result = await database.query(
            'SELECT * FROM public.order where order_status_id = 1 OR order_status_id = 2 OR order_status_id = 3 ORDER BY update_time DESC OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found order")
        }
        console.log("user_all: ", mUser)
        const res = []
        for(let item of result.rows) {
        
            res.push({
                id: item.id,
                order_date: item.order_date,
                update_date: item.update_time,
                order_type: mType.get(item.order_type_id),
                total: item.total,
                order_status: mStatus.get(item.order_status_id),
                customer: mCustomer.get(item.customer_id),
                user: mUser.get(item.user_id),
            })
        }

        return {
            items: res,
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

export async function getOrderByStatus(id, _page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const mType = await getMapOrderType()
        const mStatus = await getMapOrderStatus()
        const mUser = await getMapUser()
        const mCustomer = await getMapCustomer()
        const all = await database.query(
            'SELECT * FROM public.order where order_status_id = $1',
            [id]
        )
        if(all.rowCount == 0) {
            throw Error("Not found order")
        }
        const result = await database.query(
            'SELECT * FROM public.order where order_status_id = $1 ORDER BY update_date DESC OFFSET $2 LIMIT $3',
            [id, offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found order")
        }

        const res = []
        for(let item of result.rows) {
            res.push({
                id: item.id,
                order_date: item.order_date,
                update_date: item.update_date,
                order_type: mType.get(item.order_type_id),
                total: item.total,
                order_status: mStatus.get(item.order_status_id),
                customer: mCustomer.get(item.customer_id),
                user: mUser.get(item.user_id),
            })
        }

        return {
            items: res,
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

export async function changeOrderStatus(id, status_id){
    try {
        let updateQuery = `
                UPDATE public.order
                SET order_status_id = $2,
                    update_date = current_date
                WHERE id = $1
                RETURNING *;
            `;
        const up_result = await database.query(updateQuery,
            [id, status_id]
        );
        if(up_result.rows[0].order_type_id == 1 && up_result.rows[0].customer_id != 1) {
            const mStatus = await getMapOrderStatus()
            
            const mCustomer = await getMapCustomer()
            const status = mStatus.get(up_result.rows[0].order_status_id)
            const customer = mCustomer.get(up_result.rows[0].customer_id) || {email: "nore@example.com", name: "bạn"}
            sendEmail(customer.email,"Cập nhật trạng thái đơn hàng",`Xin chào ${customer.name}, đơn hàng của bạn đã được cập nhật sang trạng thái: ${status}`)
        }
        return true
    } catch (error) {
        throw error
    }
}


export async function getOrderStatus(_page, _limit){
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const offset = (page - 1) * limit;
    try {
     
        const all = await database.query(
            'SELECT * FROM public.order_status'
        )
        if(all.rowCount == 0) {
            throw Error("Not found order")
        }
        const result = await database.query(
            'SELECT * FROM public.order_status ORDER BY id OFFSET $1 LIMIT $2',
            [offset, limit]
        );
        if(result.rowCount == 0) {
            throw Error("Not found order")
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