import { sendEmail } from "../../common/email.js";
import { database } from "../../database/postgresql.js";


export async function getGeneralStatistic(){
    try {
        // const mType = await getMapOrderType()
        // const mStatus = await getMapOrderStatus()
        // const mUser = await getMapUser()
        // const mCustomer = await getMapCustomer()
        const all = await database.query(
            `SELECT o.order_status_id, ot.name, CAST(COUNT(*) AS INTEGER) AS total
                FROM public.order o
                JOIN
                order_status ot ON o.order_status_id = ot.id
                WHERE EXTRACT(DAY FROM update_time) = EXTRACT(DAY FROM CURRENT_TIMESTAMP)
                    AND EXTRACT(MONTH FROM update_time) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)
                    AND EXTRACT(YEAR FROM update_time) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP)
                GROUP BY
                    ot.name, o.order_status_id
                ORDER By o.order_status_id
            `
        )
        if(all.rowCount == 0) {
            throw Error("Not found order")
        }
        return all.rows
    } catch (error) {
        throw error
    }
}

export async function getTopProduct(_top){
    const top = parseInt(_top) || 10;
    try {
        // const mType = await getMapOrderType()
        // const mStatus = await getMapOrderStatus()
        // const mUser = await getMapUser()
        // const mCustomer = await getMapCustomer()
        const all = await database.query(
            `SELECT
                p.id,
                p.name,
                SUM(oi.qty) AS qty

            FROM
                order_item oi
            JOIN
                product p ON oi.product_id = p.id
            JOIN
                public."order" o ON oi.order_id = o.id
            WHERE
                o.order_date = CURRENT_DATE
            GROUP BY
                p.id, p.name
            ORDER BY
            qty DESC
            LIMIT $1;
        `,
            [top]
        )
        if(all.rowCount == 0) {
            throw Error("Not found order")
        }
        return all.rows
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