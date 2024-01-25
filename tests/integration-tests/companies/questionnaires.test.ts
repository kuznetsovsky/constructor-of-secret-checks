import request from 'supertest'
import { app } from '../../../source/app'

describe('Company questionnaire endpoints:', () => {
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

  describe('GET: /companies/questionnaire', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).get('/api/v1/companies/questionnaire')
      expect(response.statusCode).toBe(401)
    })

    it('should return questionnaire data', async () => {
      const response = await request(app)
        .get('/api/v1/companies/questionnaire')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 2,
        link: expect.any(String),
        token: expect.any(String),
        description: 'Описание акеты',
        is_required_city: true,
        is_required_address: true,
        is_required_phone_number: true,
        is_required_vk_link: true,
        is_required_birthday: true
      })
    })
  })

  describe('PUT: /companies/questionnaire', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).put('/api/v1/companies/questionnaire')
      expect(response.statusCode).toBe(401)
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
        .put('/api/v1/companies/questionnaire')
        .set('Cookie', cookie)
        .send(QUESTIONNAIRE_DATA)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        ...QUESTIONNAIRE_DATA,
        id: 2,
        link: expect.any(String),
        token: expect.any(String)
      })
    })
  })
})
