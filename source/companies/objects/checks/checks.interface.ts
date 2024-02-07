import { type ObjectCheckStatus } from '../../../consts'

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

interface Status {
  status:
  | ObjectCheckStatus.Appointed
  | ObjectCheckStatus.Checking
  | ObjectCheckStatus.Fulfilled
  | ObjectCheckStatus.Refusal
}

interface StatusWithCommit {
  status: ObjectCheckStatus.Revision
  comment: string
}

export type CheckStatus = Status | StatusWithCommit
