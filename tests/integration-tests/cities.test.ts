import request from 'supertest'
import { app } from '../../source/app'

describe('Cities endpoints:', () => {
  let cookie = ''

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: 'www.jhon@mail.com',
        password: 'Qwerty1234'
      })

    cookie = response.headers['set-cookie']
  })

  afterAll(async () => {
    await request(app).delete('/api/v1/sign-out')
    cookie = ''
  })

  describe('GET: /cities', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).get('/api/v1/cities')
      expect(response.statusCode).toBe(401)
    })

    it('should return a list of cities', async () => {
      const response = await request(app)
        .get('/api/v1/cities')
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

  describe('GET: /cities/{city_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).get('/api/v1/cities/1')
      expect(response.statusCode).toBe(401)
    })

    it('should return the status not found', async () => {
      const response = await request(app)
        .get('/api/v1/cities/100')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return city information', async () => {
      const response = await request(app)
        .get('/api/v1/cities/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        name: 'Moscow'
      })
    })
  })
})
