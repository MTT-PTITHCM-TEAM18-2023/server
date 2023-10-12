import { sendEmail } from "../../common/email.js";
import { generateRandomString } from "../../common/strings.js";
import { database } from "../../database/postgresql.js";


async function deleteOrder(order_id) {
    try {
      const deleteQuery = `
        DELETE FROM public.order
        WHERE id = $1;
      `;
      await database.query(deleteQuery, [order_id]);
    } catch (error) {
      console.error('Error deleting order:', error.message);
    }
}

async function deleteOrderItem(order_id) {
    try {
      const deleteQuery = `
        DELETE FROM order_item
        WHERE order_id = $1;
      `;
  
      await database.query(deleteQuery, [order_id]);
    } catch (error) {
      console.error('Error deleting order item:', error.message);
    }
}

export async function placeOrder(customer, email, items) {
    try {
        let query = `
            SELECT * FROM customer WHERE email = $1
        `;
        const c_res = await database.query(query,
            [email]
        );
        let customer_id = 0
        if(c_res.rowCount == 0) {
            const query = `
                INSERT INTO customer (email, name, phone, address, is_loyal)
                VALUES ($1, $2, $3, $4, false)
                RETURNING *;
            `;
            const result = await database.query(query,
                [email, customer.name, customer.phone, customer.address]
            );
            customer_id = result.rows[0].id
        } else {
            customer_id = c_res.rows[0].id
        }

        query = `
            INSERT INTO public.order (order_date, order_type_id, total, customer_id, user_id, order_status_id, update_time)
            VALUES (current_date, 1, 0, $1, null, 1, current_timestamp)
            RETURNING *;
            `;
        const o_res = await database.query(query,
            [customer_id]
        );
        let order_id = o_res.rows[0].id
        let total = 0
        const list = []
        for(let item of items){
            let query = `
                SELECT * FROM product WHERE id = $1 AND is_active = true
            `;
            const p_res = await database.query(query,
                [item.product_id]
            );
            if (p_res.rowCount == 0) {
                await deleteOrderItem(order_id)
                await deleteOrder(order_id)
                throw Error("Not found product: id " + item.product_id)
            }

            if (p_res.rows[0].qty < item.qty) {
                await deleteOrderItem(order_id)
                await deleteOrder(order_id)
                throw Error("Insufficient quantity: id " + item.product_id)
            }
            list.push({
                "product_id" : item.product_id,
                "qty": item.qty,
                "stock_qty": p_res.rows[0].qty,
                "price": p_res.rows[0].price
            })
        }
        for(let item of list) {
            const insertQuery = `
            INSERT INTO order_item (order_id, product_id, qty)
             VALUES ($1, $2, $3)
             RETURNING *;
            `;
            const oi_result = await database.query(insertQuery,
                [order_id, item.product_id, item.qty]
            );
            let new_qty = item.stock_qty - item.qty
            let updateQuery = `
                UPDATE product
                SET qty = $1
                WHERE id = $2
            `;
            const up_result = await database.query(updateQuery,
                [new_qty, item.product_id]
            );
            total = total + (item.qty * item.price)
        }
        let updateQuery = `
            UPDATE public.order
            SET total = $1
            WHERE id = $2
        `;
        const o_result = await database.query(updateQuery,
            [total, order_id]
        );
        const msg = `
            Đơn hàng của bạn đã được tạo thành công. Tổng giá trị đơn hàng là ${total} VND.
            Dự kiến đơn hàng sẽ được giao sau 3 ngày kể từ ngày đặt hàng. 
            Vui lòng theo dõi email để cập nhật thông tin đơn hàng!
            Cám ơn bạn đã lựa chọn chúng tôi!
        `
        await sendEmail(email, "Đặt hàng thành công", msg);
        return {
            "id": order_id,
            "total": total
        };
    } catch (error) {
        throw error
    }
}

export async function orderInStore(customer, items, user_id) {
    try {
        let customer_id = 1
        if (customer != -1) {
            const query = `
                SELECT * FROM customer WHERE email = $1
            `;
            const c_res = await database.query(query,
                [customer.email]
            );
            if(c_res.rowCount == 0) {
                const query = `
                    INSERT INTO customer (email, name, phone, address, is_loyal)
                    VALUES ($1, $2, $3, $4, false)
                    RETURNING *;
                `;
                const result = await database.query(query,
                    [customer.email, customer.name, customer.phone, customer.address]
                );
                customer_id = result.rows[0].id
            } else {
                customer_id = c_res.rows[0].id
            }
        }
        const query = `
            INSERT INTO public.order (order_date, order_type_id, total, customer_id, user_id, order_status_id, update_time)
            VALUES (current_date, 2, 0, $1, $2, 2, current_timestamp)
            RETURNING *;
            `;
        const o_res = await database.query(query,
            [customer_id, user_id]
        );
        let order_id = o_res.rows[0].id
        let total = 0
        const list = []
        for(let item of items){
            let query = `
                SELECT * FROM product WHERE id = $1 AND is_active = true
            `;
            const p_res = await database.query(query,
                [item.product_id]
            );
            if (p_res.rowCount == 0) {
                await deleteOrderItem(order_id)
                await deleteOrder(order_id)
                throw Error("Not found product: id " + item.product_id)
            }

            if (p_res.rows[0].qty < item.qty) {
                await deleteOrderItem(order_id)
                await deleteOrder(order_id)
                throw Error("Insufficient quantity: id " + item.product_id)
            }
            list.push({
                "product_id" : item.product_id,
                "qty": item.qty,
                "stock_qty": p_res.rows[0].qty,
                "price": p_res.rows[0].price
            })
        }
        for(let item of list) {
            const insertQuery = `
            INSERT INTO order_item (order_id, product_id, qty)
             VALUES ($1, $2, $3)
             RETURNING *;
            `;
            const oi_result = await database.query(insertQuery,
                [order_id, item.product_id, item.qty]
            );
            let new_qty = item.stock_qty - item.qty
            let updateQuery = `
                UPDATE product
                SET qty = $1
                WHERE id = $2
            `;
            const up_result = await database.query(updateQuery,
                [new_qty, item.product_id]
            );
            total = total + (item.qty * item.price)
        }
        let updateQuery = `
            UPDATE public.order
            SET total = $1
            WHERE id = $2
        `;
        const o_result = await database.query(updateQuery,
            [total, order_id]
        );
        return {
            "id": order_id,
            "total": total
        };
    } catch (error) {
        throw error
    }
}