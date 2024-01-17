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
      expect(response.body.cities).toEqual([
        { id: 1, name: 'Moscow' },
        { id: 2, name: 'Saint Petersburg' },
        { id: 3, name: 'Novosibirsk' },
        { id: 4, name: 'Yekaterinburg' },
        { id: 5, name: 'Nizhny Novgorod' },
        { id: 6, name: 'Kazan' },
        { id: 7, name: 'Rostov-on-Don' },
        { id: 8, name: 'Sochi' }
      ])
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
