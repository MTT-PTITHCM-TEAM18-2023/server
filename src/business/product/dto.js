export class ProductDTO {
    constructor({id, name, description, price, image_url, category_id, supplier_id, unit, qty, is_active}) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.imageUrl = image_url
        this.categoryId = category_id
        this.suplierId = supplier_id
        this.unit = unit
        this.qty = qty
        this.isActive = is_active
    }
}