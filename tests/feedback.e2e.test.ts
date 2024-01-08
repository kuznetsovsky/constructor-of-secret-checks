import request from 'supertest'
import { app } from '../source/app'

describe('Feedback endpoint:', () => {
  const SIGN_IN_URL = '/api/v1/auth/sign-in'

  it('should return a validation error', async () => {
    const authResponse = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: 'www.jhon@mail.com',
        password: 'Qwerty1234'
      })

    expect(authResponse.status).toEqual(200)
    const cookies = authResponse.headers['set-cookie']

    // SEND FEEDBACK
    // =-=-=-=-=-=-=-=-=-=

    const response = await request(app)
      .post('/api/v1/feedback')
      .set('Cookie', cookies)
      .send({
        message: 'Предложение убрать рекламу с сайта. Предложение убрать рекламу с сайта. Предложение убрать рекламу с сайта. Предложение убрать рекламу с сайта. Предложение убрать рекламу с сайта.'
      })

    expect(response.statusCode).toBe(422)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body.message).toMatch(/Validation failed/i)
  })

  it('should return successful status code 200', async () => {
    const authResponse = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: 'www.jhon@mail.com',
        password: 'Qwerty1234'
      })

    expect(authResponse.status).toEqual(200)
    const cookies = authResponse.headers['set-cookie']

    // SEND FEEDBACK
    // =-=-=-=-=-=-=-=-=-=

    const response = await request(app)
      .post('/api/v1/feedback')
      .set('Cookie', cookies)
      .send({
        message: 'Предложение убрать рекламу с сайта.'
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })
})
