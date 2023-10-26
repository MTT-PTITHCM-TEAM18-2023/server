import {Status, StatusCode} from "../common/common.js";

import ProductBusiness from "../business/product/product.js";
import { MSG } from "../common/message.js";


const get = async (req, res) => {
    const {page, limit, cat} = req.query
    if (cat && !isNaN(cat)) {
        const items = await ProductBusiness.getByCat(cat, page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_PRODUCT_BY_CAT_FAILED,
            });
            return
        }

        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_PRODUCT_BY_CAT_SUCCESS,
            data: items
        });
    } else {
        const items = await ProductBusiness.get(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: MSG.GET_PRODUCT_FAILED,
            });
            return
        }
    
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_PRODUCT_SUCCESS, 
            data: items
        }); 
    }
}

const getById = async (req, res) => {
    const {id} = req.params
    const product = await ProductBusiness.getById(id)

    if (product) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.GET_PRODUCT_BY_ID_SUCCESS,
            data: product
        })
    }
    else {
        res.status(StatusCode.NOT_FOUND).json({
            status: Status.NOT_FOUND,
            message: MSG.GET_PRODUCT_BY_ID_FAILED
        })
    }
}

const create = async (req, res) => {

    if (req.body.name == "" || !isNumber(req.body.price) || req.body.imageUrl == "" || !isNumber(req.body.categoryId) ||  !isNumber(req.body.supplierId) || req.body.unit == "" || !isNumber(req.body.qty)){
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: MSG.PRODUCT_INFO_INVALID,
        });
    } 

    const created = await ProductBusiness.create(req.body)
    if (created) {
        res.status(StatusCode.CREATED).json({
            status: Status.CREATED,
            message: MSG.CREATE_PRODUCT_SUCCESS,
            data: req.body
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.BAD_REQUEST,
            message: MSG.CREATE_CAT_FAILED
        })
    }
}

const update = async (req, res) => {
    const {id} = req.params
    const data = req.body
    const updated = await ProductBusiness.update(id, data)

    if (updated) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.UPDATE_PRODUCT_SUCCESS
        })
    }
    else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.BAD_REQUEST,
            message: MSG.UPDATE_PRODUCT_FAILED
        })
    }
}

const deleteById = async (req, res) => {
    const {id} = req.params
    const deleted = await ProductBusiness.deleteById(id)

    if (deleted) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.DELETE_PRODUCT_SUCCESS
        })
    }
    else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.BAD_REQUEST,
            message: MSG.DELETE_PRODUCT_FAILED
        })
    }
}

const getByCat = async (req, res) => {
    // const {id} = req.params
    const {page, limit, cat} = req.query
    
}


const findByName = async (req, res) => {
    const name = req.query.name
    const product = await ProductBusiness.findByName(name)

    if (product) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: MSG.FIND_BY_NAME_PRODUCT_SUCCESS,
            data: product
        })
    }
    else {
        res.status(StatusCode.NOT_FOUND).json({
            status: Status.NOT_FOUND,
            message: MSG.FIND_BY_NAME_PRODUCT_FAILED
        })
    }
}
const ProductHandlers = {
    get,
    getById,
    create,
    update,
    deleteById,
    // getByCat
    findByName
}
export default ProductHandlers
