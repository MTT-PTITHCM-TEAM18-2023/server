import {Status, StatusCode} from "../common/common.js";

import ProductBusiness from "../business/product/product.js";


const get = async (req, res) => {
    const {page, limit, cat} = req.query
    if (cat && !isNaN(cat)) {
        const items = await ProductBusiness.getByCat(cat, page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get product by category",
            });
            return
        }

        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get product by category successfully!",
            data: items
        });
    } else {
        const items = await ProductBusiness.get(page, limit)
        if (items == null) {
            res.status(StatusCode.BAD_REQUEST).json({
                status: Status.FAILED,
                message: "Failed to get product",
            });
            return
        }
    
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: "Get product successfully!",
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
            message: `Get product ${id} successfully!`,
            data: product
        })
    }
    else {
        res.status(StatusCode.NOT_FOUND).json({
            status: Status.NOT_FOUND,
            message: `Product ${id} not found!`
        })
    }
}

const create = async (req, res) => {

    if (req.body.name == "" || !isNumber(req.body.price) || req.body.imageUrl == "" || !isNumber(req.body.categoryId) ||  !isNumber(req.body.supplierId) || req.body.unit == "" || !isNumber(req.body.qty)){
        res.status(StatusCode.INTERNAL_SERVER).json({
            status: Status.ERROR,
            message: "Invalid product infomation!",
        });
    } 

    const created = await ProductBusiness.create(req.body)
    if (created) {
        res.status(StatusCode.CREATED).json({
            status: Status.CREATED,
            message: "Create a new product successfully!",
            data: req.body
        })
    } else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.BAD_REQUEST,
            message: "Can not create the product!"
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
            message: `Update the product ${id} successfully!`
        })
    }
    else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.BAD_REQUEST,
            message: `Can not update product ${id}`
        })
    }
}

const deleteById = async (req, res) => {
    const {id} = req.params
    const deleted = await ProductBusiness.deleteById(id)

    if (deleted) {
        res.status(StatusCode.OK).json({
            status: Status.OK,
            message: `Delete the product ${id} successfully!`
        })
    }
    else {
        res.status(StatusCode.BAD_REQUEST).json({
            status: Status.BAD_REQUEST,
            message: `Can not delete product ${id}!`
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
            message: `Get product ${id} successfully!`,
            data: product
        })
    }
    else {
        res.status(StatusCode.NOT_FOUND).json({
            status: Status.NOT_FOUND,
            message: `Product ${id} not found!`
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
