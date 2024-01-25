export const createQuestionnaireUrl = (companyId: number, token: string): string => {
  return `/questionnaire?company_id=${companyId}&token=${token}`
}
