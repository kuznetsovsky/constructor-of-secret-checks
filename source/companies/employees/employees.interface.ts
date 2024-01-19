export interface CreateEmployee {
  first_name: string
  last_name: string
  city_id: number
  email: string
}

export interface UpdateEmployee extends Omit<CreateEmployee, 'email'> {
  phone_number: string
}

export interface EmployeeParams {
  employee_id: string
}
