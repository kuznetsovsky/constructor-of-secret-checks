import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const FEEDBACK_URL = '/api/v1/feedback'

  describe(`not authorized sends request to POST: ${FEEDBACK_URL}`, () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).post(FEEDBACK_URL)
      expect(response.statusCode).toBe(401)
    })
  })

  describe(`authorized sends request to POST: ${FEEDBACK_URL}`, () => {
    let adminCookie = ''

    beforeAll(async () => {
      const response = await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      adminCookie = response.headers['set-cookie']
    })

    afterAll(async () => {
      await request(app).delete(LOGOUT_URL)
      adminCookie = ''
    })

    it('should return a validation error', async () => {
      const response = await request(app).post(FEEDBACK_URL)
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(422)
    })

    it('should limit feedback sending', async () => {
      { // 1 request
        const response = await request(app).post(FEEDBACK_URL)
          .set('Cookie', adminCookie)
          .send({ message: 'Предложение убрать рекламу с главной страницы сайта.' })

        expect(response.statusCode).toBe(200)
      }
      { // 2 request
        const response = await request(app).post(FEEDBACK_URL)
          .set('Cookie', adminCookie)
          .send({ message: 'Предложение убрать рекламу с главной страницы сайта.' })

        expect(response.statusCode).toBe(400)
        expect(response.body.message)
          .toMatch(/You have already sent your message. You will be able to send a new message only after an hour./i)
      }
    })

    it('should return a 200 status code and an empty response body', async () => {
      const response = await request(app).post(FEEDBACK_URL)
        .set('Cookie', adminCookie)
        .send({ message: 'Предложение убрать рекламу с сайта.' })

      expect(response.statusCode).toBe(200)
    })
  })
})
