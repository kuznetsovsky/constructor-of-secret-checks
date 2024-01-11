import request from 'supertest'
import { app } from '../../source/app'

describe('Company questionnaires endpoints:', () => {
  let cookie = ''

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: 'www.alex@mail.com',
        password: 'Qwerty1234'
      })

    cookie = response.headers['set-cookie']
  })

  afterAll(async () => {
    await request(app).delete('/api/v1/sign-out')
    cookie = ''
  })

  describe('GET: /companies/{companyId}/questionnaire', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).get('/api/v1/companies/1/questionnaire')
      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/5/questionnaire')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return questionnaire data', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/questionnaire')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 2,
        description: 'Описание акеты',
        is_required_city: true,
        is_required_address: true,
        is_required_phone_number: true,
        is_required_vk_link: true,
        is_required_birthday: true
      })
    })
  })

  describe('PUT: /companies/{companyId}/questionnaire', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).put('/api/v1/companies/1/questionnaire')
      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/5/questionnaire')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a data validation error (invalid types)', async () => {
      const QUESTIONNAIRE_DATA = {
        description: null,
        is_required_city: null,
        is_required_address: null,
        is_required_phone_number: null,
        is_required_vk_link: null,
        is_required_birthday: null
      }

      const response = await request(app)
        .put('/api/v1/companies/2/questionnaire')
        .set('Cookie', cookie)
        .send(QUESTIONNAIRE_DATA)

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/description',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/is_required_city',
            message: 'must be boolean'
          }),
          expect.objectContaining({
            instancePath: '/is_required_address',
            message: 'must be boolean'
          }),
          expect.objectContaining({
            instancePath: '/is_required_phone_number',
            message: 'must be boolean'
          }),
          expect.objectContaining({
            instancePath: '/is_required_vk_link',
            message: 'must be boolean'
          }),
          expect.objectContaining({
            instancePath: '/is_required_birthday',
            message: 'must be boolean'
          })
        ])
      )
    })

    it('should return a data validation error (maximum number of characters in lines)', async () => {
      const QUESTIONNAIRE_DATA = {
        description: 'C7rxBAbg1OrYuE8xdSKmDPxumWsnPHNOXwm2w1f5Ka4PCKGB1fooeHhXDCKxbt7f9Smsvc3G5xbHq6MEFtAmAaryJ8zQ4Sx1HOKa4PCKGB1fooeHhXDCKxbrW',
        is_required_city: false,
        is_required_address: false,
        is_required_phone_number: false,
        is_required_vk_link: false,
        is_required_birthday: false
      }

      const response = await request(app)
        .put('/api/v1/companies/2/questionnaire')
        .set('Cookie', cookie)
        .send(QUESTIONNAIRE_DATA)

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/description',
            message: 'must NOT have more than 120 characters'
          })
        ])
      )
    })

    it('should return updated questionnaire data', async () => {
      const QUESTIONNAIRE_DATA = {
        description: 'Обновленное описание акеты',
        is_required_city: true,
        is_required_address: true,
        is_required_phone_number: true,
        is_required_vk_link: false,
        is_required_birthday: false
      }

      const response = await request(app)
        .put('/api/v1/companies/2/questionnaire')
        .set('Cookie', cookie)
        .send(QUESTIONNAIRE_DATA)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ ...QUESTIONNAIRE_DATA, id: 2 })
    })
  })
})
