import request from 'supertest'
import { app } from '../../../source/app'

describe('Company objects endpoints:', () => {
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

  describe('POST: /companies/{company_id}/objects', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/companies/1/objects')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/5/objects')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a failed check status (invalid types)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/objects')
        .set('Cookie', cookie)
        .send({
          entry_type: null,
          name: null,
          street: null,
          house_number: null,
          city_id: null
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/entry_type',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/entry_type',
            params: { allowedValues: ['manual', 'public'] },
            message: 'must be equal to one of the allowed values'
          }),
          expect.objectContaining({
            instancePath: '/name',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/street',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/house_number',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be number'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/objects')
        .set('Cookie', cookie)
        .send({
          entry_type: 'manual',
          name: 'qPZ4WHA20twEFXJCH0QYJ30FaGGG5bjmu',
          street: 'upS2nt9ZmaFkbRRJVXbYaOyyG1tOQHMgj0Svse5SOftyeHexpsJdaZ6468yxY',
          house_number: 'nuTQFeXzM',
          city_id: 1
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have more than 32 characters'
          }),
          expect.objectContaining({
            instancePath: '/street',
            message: 'must NOT have more than 60 characters'
          }),
          expect.objectContaining({
            instancePath: '/house_number',
            message: 'must NOT have more than 8 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/objects')
        .set('Cookie', cookie)
        .send({
          entry_type: 'manual',
          name: 'Axa',
          street: 'Central Street',
          house_number: '1A',
          city_id: 0
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have fewer than 5 characters'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be >= 1'
          })
        ])
      )
    })

    it('should return conflict status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/objects')
        .set('Cookie', cookie)
        .send({
          entry_type: 'public',
          name: 'Bosco Cafe',
          street: 'Central Street',
          house_number: '1A',
          city_id: 1
        })

      expect(response.statusCode).toBe(409)
      expect(response.body.error).toMatch(/This name already exists/i)
    })

    it('should return city not found status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/objects')
        .set('Cookie', cookie)
        .send({
          entry_type: 'public',
          name: 'Soika',
          street: 'Central Street',
          house_number: '1A',
          city_id: 100
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.error).toMatch(/City is not found/i)
    })

    it('should successfully create the company object', async () => {
      const COMPANY_OBJECT_DATA = {
        entry_type: 'public',
        name: 'Res-o-Run',
        street: 'Central Street',
        house_number: '1A'
      }

      const response = await request(app)
        .post('/api/v1/companies/2/objects')
        .set('Cookie', cookie)
        .send({
          ...COMPANY_OBJECT_DATA,
          city_id: 1
        })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        ...COMPANY_OBJECT_DATA,
        id: 4,
        city: {
          id: 1,
          name: 'Moscow'
        }
      })
    })
  })

  describe('GET: /companies/{company_id}/objects', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/1/objects')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/5/objects')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a list of company objects', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/objects')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.objects.length).toBe(2)
      expect(response.body.objects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            entry_type: 'public',
            name: 'Bosco Cafe',
            street: 'Red square',
            house_number: '3A',
            city: {
              id: 1,
              name: 'Moscow'
            }
          }),
          expect.objectContaining({
            id: 3,
            entry_type: 'manual',
            name: 'Bosco Bar',
            street: 'Okhotny Ryad',
            house_number: '23',
            city: {
              id: 1,
              name: 'Moscow'
            }
          })
        ])
      )
    })
  })

  describe('GET: /companies/{company_id}/objects/{object_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/1/objects/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/5/objects/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return not found status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/objects/2')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return company object data', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 3,
        entry_type: 'manual',
        name: 'Bosco Bar',
        street: 'Okhotny Ryad',
        house_number: '23',
        city: {
          id: 1,
          name: 'Moscow'
        }
      })
    })
  })

  describe('PUT: /companies/{company_id}/objects/{object_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .put('/api/v1/companies/1/objects/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/5/objects/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return not found status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/objects/2')
        .set('Cookie', cookie)
        .send({
          entry_type: 'public',
          name: 'The Name',
          street: 'Central Street',
          house_number: '1A',
          city_id: 1
        })

      expect(response.statusCode).toBe(404)
    })

    it('should return a failed check status (invalid types)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)
        .send({
          entry_type: null,
          name: null,
          street: null,
          house_number: null,
          city_id: null
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/entry_type',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/entry_type',
            params: { allowedValues: ['manual', 'public'] },
            message: 'must be equal to one of the allowed values'
          }),
          expect.objectContaining({
            instancePath: '/name',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/street',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/house_number',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be number'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)
        .send({
          entry_type: 'manual',
          name: 'qPZ4WHA20twEFXJCH0QYJ30FaGGG5bjmu',
          street: 'upS2nt9ZmaFkbRRJVXbYaOyyG1tOQHMgj0Svse5SOftyeHexpsJdaZ6468yxY',
          house_number: 'nuTQFeXzM',
          city_id: 1
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have more than 32 characters'
          }),
          expect.objectContaining({
            instancePath: '/street',
            message: 'must NOT have more than 60 characters'
          }),
          expect.objectContaining({
            instancePath: '/house_number',
            message: 'must NOT have more than 8 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)
        .send({
          entry_type: 'manual',
          name: 'Axa',
          street: 'Central Street',
          house_number: '1A',
          city_id: 0
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have fewer than 5 characters'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be >= 1'
          })
        ])
      )
    })

    it('should return conflict status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)
        .send({
          entry_type: 'public',
          name: 'Bosco Cafe',
          street: 'Central Street',
          house_number: '1A',
          city_id: 1
        })

      expect(response.statusCode).toBe(409)
      expect(response.body.error).toMatch(/This name already exists/i)
    })

    it('should return city not found status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)
        .send({
          entry_type: 'public',
          name: 'Soika',
          street: 'Central Street',
          house_number: '1A',
          city_id: 100
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.error).toMatch(/City is not found/i)
    })

    it('should successfully update the company object data', async () => {
      const COMPANY_OBJECT_DATA = {
        entry_type: 'public',
        name: 'Res-o-Run',
        street: 'Central Street',
        house_number: '1A'
      }

      const response = await request(app)
        .put('/api/v1/companies/2/objects/3')
        .set('Cookie', cookie)
        .send({
          ...COMPANY_OBJECT_DATA,
          city_id: 6
        })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        ...COMPANY_OBJECT_DATA,
        id: 3,
        city: {
          id: 6,
          name: 'Kazan'
        }
      })
    })
  })

  describe('DELETE: /companies/{company_id}/objects/{object_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/1/objects/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/5/objects/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return not found status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/2/objects/2')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return no content status', async () => {
      {
        const response = await request(app)
          .delete('/api/v1/companies/2/objects/3')
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(204)
      }

      {
        const response = await request(app)
          .get('/api/v1/companies/2/objects/3')
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(404)
      }
    })
  })
})
