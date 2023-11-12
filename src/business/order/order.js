import CommonMethod from "../../common/method.js";
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

async function getMapProduct() {
    try {
        const all = await database.query(
            'SELECT * FROM product'
        )
        if (all.rowCount == 0) {
            return null
        }
        const m = new Map();
        for (const row of all.rows){
            m.set(row.id, {name: row.name, price: row.price});
        }
        return m
    } catch (error) {
        return null
    }
}


async function getDetail(id){
    try {
        const mType = await getMapOrderType()
        const mStatus = await getMapOrderStatus()
        const mUser = await getMapUser()
        const mCustomer = await getMapCustomer()
        const mProduct = await getMapProduct()
        const order = await database.query(
            'SELECT * FROM public.order where id = $1',
            [id]
        )
        if(order.rowCount == 0) {
            throw Error("Not found order")
        }
        const items = await database.query(
            'SELECT * FROM public.order_item where order_id = $1',
            [order.rows[0].id]
        )
        const res = []
        for(let item of items.rows) {
            res.push({
                name: mProduct.get(item.product_id).name,
                price: mProduct.get(item.product_id).price,
                qty: item.qty,
            })
        }
        return {
            id: order.rows[0].id,
            order_date: order.rows[0].order_date,
            update_date: order.rows[0].update_time,
            order_type: mType.get(order.rows[0].order_type_id),
            total: order.rows[0].total,
            order_status: mStatus.get(order.rows[0].order_status_id),
            customer: mCustomer.get(order.rows[0].customer_id),
            user: mUser.get(order.rows[0].user_id),
            items: res
      } 
    } catch (error) {
        throw error
    }
}


async function getPending(_page, _limit){
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

async function getByStatus(id, _page, _limit){
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
async function changeStatus(id, status_id){
    try {
        const mStatus = await getMapOrderStatus()
        const result = await database.query(
            'SELECT * FROM public.order where id = $1',
            [id]
        );

        if(result.rows[0].order_status_id == 4 || result.rows[0].order_status_id == 5) {
            const status = mStatus.get(result.rows[0].order_status_id)
            const msg = "Trạng thái đơn hàng hiện tại là: " + status + ". Không thể thay đổi trạng thái đơn hàng!"
            throw Error(msg)
        }
        if(result.rows[0].order_status_id == 3 && status_id == 5) {
            throw Error("Đơn hàng đang vận chuyển, không thể huỷ!")
        }
        if (result.rows[0].order_status_id > status_id) {
            const curStatus = mStatus.get(result.rows[0].order_status_id)
            const changeStatus = mStatus.get(status_id)
            const msg = "Trạng thái đơn hàng hiện tại là: " + curStatus + ". Không thể thay đổi thành trạng thái: " + changeStatus + "."
            throw Error(msg)
        }
        if(result.rowCount == 0) {
            throw Error("Not found order")
        }
        if(result.rows[0].order_status_id == 1 && (status_id != 5 && status_id != 2)) {
            const curStatus = mStatus.get(result.rows[0].order_status_id)
            const changeStatus = mStatus.get(status_id)
            const msg = "Trạng thái đơn hàng hiện tại là: " + curStatus + ". Không thể thay đổi thành trạng thái: " + changeStatus + "."
            throw Error(msg)
        }
        if(result.rows[0].order_status_id == 2 && (status_id != 5 && status_id != 3)) {
            const curStatus = mStatus.get(result.rows[0].order_status_id)
            const changeStatus = mStatus.get(status_id)
            const msg = "Trạng thái đơn hàng hiện tại là: " + curStatus + ". Không thể thay đổi thành trạng thái: " + changeStatus + "."
            throw Error(msg)
        }
        let updateQuery = `
                UPDATE public.order
                SET order_status_id = $2,
                    update_time = current_date
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
            await CommonMethod.sendEmail(customer.email,"Cập nhật trạng thái đơn hàng",`Xin chào ${customer.name}, đơn hàng của bạn đã được cập nhật sang trạng thái: ${status}`)
        }
        return true
    } catch (error) {
        throw error
    }
}


async function getStatus(_page, _limit){
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



const OrderBusiness = {
    getDetail,
    getPending,
    getStatus,
    changeStatus,
    getByStatus,
}

export default OrderBusiness