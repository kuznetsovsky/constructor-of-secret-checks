export interface CreateCompanyObjectCheck {
  date: string
  check_type_id: number
  template_id: number
  inspector_id: number
}

export interface UpdateCompanyObjectCheck {
  check_type_id?: number
  template_id?: number
  inspector_id?: number
}

export interface ChecksParams {
  check_id: string
}
