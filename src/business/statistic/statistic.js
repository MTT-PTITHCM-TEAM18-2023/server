import { database } from "../../database/postgresql.js";


async function getGeneral(){
    try {

        const product = await database.query(
            `
            select count(distinct product_id) as num
            from order_item as oi
            join public.order as o ON oi.order_id = o.id
            where o.order_date >= CURRENT_DATE - INTERVAL '30 days'
                AND o.order_date <= CURRENT_DATE;
            `
        )
        const total = await database.query(
            `
            select sum(total) as num
            from public.order as o
            where o.order_date >= CURRENT_DATE - INTERVAL '30 days'
                AND o.order_date <= CURRENT_DATE;
            `
        )
        const canceled = await database.query(
            `
            select count(id) as num
            from public.order as o
            where (o.order_date >= CURRENT_DATE - INTERVAL '30 days'
                AND o.order_date <= CURRENT_DATE) AND (o.order_status_id = 5);
            `
        )
        const deliveried = await database.query(
            `
            select count(id) as num
            from public.order as o
            where (o.order_date >= CURRENT_DATE - INTERVAL '30 days'
                AND o.order_date <= CURRENT_DATE) AND (o.order_status_id = 4);
            `
        )
        let product_res = 0
        if  (product.rowCount != 0) {
            product_res = product.rows[0].num
        }
        let total_res = 0
        if  (total.rowCount != 0) {
            total_res = total.rows[0].num
        }
        let canceled_res = 0
        if  (canceled.rowCount != 0) {
            canceled_res = canceled.rows[0].num
        }
        let deliveried_res = 0
        if  (deliveried.rowCount != 0) {
            deliveried_res = deliveried.rows[0].num
        }
        return {
            product: product_res,
            total: total_res,
            canceled: canceled_res,
            deliveried: deliveried_res
        }
    } catch (error) {
        throw error
    }
}
async function getTopProduct(_top){
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
                (o.order_date >= CURRENT_DATE - INTERVAL '30 days'
                AND o.order_date <= CURRENT_DATE)
            GROUP BY
                p.id, p.name
            ORDER BY
            qty DESC
            LIMIT $1;
        `,
            [top]
        )
        if(all.rowCount == 0) {
            throw Error("Not found product")
        }
        return all.rows
    } catch (error) {
        throw error
    }
}



const StatisticBusiness = {
    getGeneral,
    getTopProduct,
}
export default StatisticBusiness