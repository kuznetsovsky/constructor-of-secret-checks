import request from 'supertest'
import { app } from '../../../source/app'

describe('Company check types endpoints:', () => {
  let adminCookie = ''

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: 'www.jane@mail.com',
        password: 'Qwerty_1234'
      })

    adminCookie = response.headers['set-cookie']
  })

  afterAll(async () => {
    await request(app).delete('/api/v1/sign-out')
    adminCookie = ''
  })

  describe('POST: /companies/check-types', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')

      expect(response.statusCode).toBe(401)
    })

    it.skip('should return forbidden status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a failed check status (invalid types)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)
        .send({ name: null })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must be string'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)
        .send({ name: 'Супер пупер мега большая проверка' })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have more than 32 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)
        .send({ name: 'И' })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have fewer than 2 characters'
          })
        ])
      )
    })

    it('should return conflict status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)
        .send({ name: 'Зал' })

      expect(response.statusCode).toBe(409)
    })

    it('should return created status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)
        .send({ name: 'Объект' })

      expect(response.statusCode).toBe(201)
      expect(response.headers.location).toMatch(/\/api\/v1\/companies\/check-types\/[0-9]/i)
      expect(response.body).toEqual({
        id: expect.any(Number),
        company_id: 1,
        name: 'Объект',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    })
  })

  describe('GET: /companies/check-types', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types')

      expect(response.statusCode).toBe(401)
    })

    it.skip('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a list of types of checks', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.types).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Зал',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          }),
          expect.objectContaining({
            id: 2,
            name: 'Кухня',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          }),
          expect.objectContaining({
            id: 3,
            name: 'Доствака',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          }),
          expect.not.objectContaining({
            id: 4,
            name: 'Доставка',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        ])
      )
    })
  })

  describe('GET: /companies/check-types/{check_type_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types/1')

      expect(response.statusCode).toBe(401)
    })

    it.skip('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types/1')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return not found status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types/4')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return check type with id 1', async () => {
      const response = await request(app)
        .get('/api/v1/companies/check-types/1')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        name: 'Зал',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    })
  })

  describe('PUT: /companies/check-types/{check_type_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/3')

      expect(response.statusCode).toBe(401)
    })

    it.skip('should return forbidden status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/3')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a failed check status (invalid types)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/3')
        .set('Cookie', adminCookie)
        .send({ name: null })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must be string'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/3')
        .set('Cookie', adminCookie)
        .send({ name: 'Супер пупер мега большая проверка' })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have more than 32 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/3')
        .set('Cookie', adminCookie)
        .send({ name: 'И' })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have fewer than 2 characters'
          })
        ])
      )
    })

    it('should return not found status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/4')
        .set('Cookie', adminCookie)
        .send({ name: 'Доставка' })

      expect(response.statusCode).toBe(404)
    })

    it('should successfully update check type', async () => {
      const response = await request(app)
        .put('/api/v1/companies/check-types/3')
        .set('Cookie', adminCookie)
        .send({ name: 'Доставка' })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 3,
        company_id: 1,
        name: 'Доставка',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    })
  })

  describe('DELETE: /companies/check-types/{check_type_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/check-types/1')

      expect(response.statusCode).toBe(401)
    })

    it.skip('should return forbidden status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/check-types/1')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return not found status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/check-types/4')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return no content status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/check-types/1')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(204)
    })
  })
})
