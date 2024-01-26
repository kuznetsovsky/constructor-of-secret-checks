import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const CITY_URL = '/api/v1/cities'
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'

  describe('not authorized', () => {
    describe(`sends request to GET: ${CITY_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(CITY_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`sends request to GET: ${CITY_URL}/{city_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${CITY_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })
  })

  describe('authorized', () => {
    let cookie = ''

    beforeAll(async () => {
      const response = await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'www.jhon@mail.com',
          password: 'Qwerty1234'
        })

      cookie = response.headers['set-cookie']
    })

    afterAll(async () => {
      await request(app).delete(LOGOUT_URL)
      cookie = ''
    })

    describe(`sends request to GET: ${CITY_URL}`, () => {
      it('should return a list of cities', async () => {
        const response = await request(app).get(CITY_URL)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body.cities).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: expect.any(Number), name: 'Moscow' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Saint Petersburg' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Novosibirsk' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Yekaterinburg' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Nizhny Novgorod' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Kazan' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Rostov-on-Don' }),
            expect.objectContaining({ id: expect.any(Number), name: 'Sochi' })
          ])
        )
      })
    })

    describe(`sends request to GET: ${CITY_URL}/{city_id}`, () => {
      it('should return the status not found', async () => {
        const response = await request(app).get(`${CITY_URL}/100`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(404)
      })

      it('should return city information', async () => {
        const response = await request(app).get(`${CITY_URL}/1`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
          id: 1,
          name: 'Moscow'
        })
      })
    })
  })
})
