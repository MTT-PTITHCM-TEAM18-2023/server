export class UserDTO {
    constructor({id, email, name, phone, address, base_salary, is_active, role_id}) {
        this.id = id
        this.email = email
        this.name = name
        this.phone = phone
        this.address = address
        this.baseSalary = base_salary
        this.isActive = is_active
        this.roleId = role_id
    }
}