import request from 'supertest'
import { app } from '../../../source/app'

describe('Company employees endpoints:', () => {
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

  describe('POST: /companies/{companyId}/employees', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/companies/1/employees')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/5/employees')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a data validation error (invalid types)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: null,
          first_name: null,
          last_name: null,
          city_id: null
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/email',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/first_name',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/last_name',
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
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: 'www.thooooooomasssssssss@mail.com',
          first_name: 'Roooooooooooooman',
          last_name: 'Maaaaaaaaaaaaaaaaaaaartin',
          city_id: 1
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/email',
            message: 'must NOT have more than 32 characters'
          }),
          expect.objectContaining({
            instancePath: '/first_name',
            message: 'must NOT have more than 16 characters'
          }),
          expect.objectContaining({
            instancePath: '/last_name',
            message: 'must NOT have more than 24 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Th',
          last_name: 'Ma',
          city_id: -1
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/first_name',
            message: 'must NOT have fewer than 3 characters'
          }),
          expect.objectContaining({
            instancePath: '/last_name',
            message: 'must NOT have fewer than 3 characters'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be >= 1'
          })
        ])
      )
    })

    it('should return a failed check status (checking format)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomasmail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          city_id: 1
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/email',
            message: 'must match format "email"'
          })
        ])
      )
    })

    it('should return the status city not found', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          city_id: 100
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.error).toMatch(/City is not found/i)
    })

    it('should return conflict status', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: 'www.jhon@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          city_id: 1
        })

      expect(response.statusCode).toBe(409)
      expect(response.body.error).toMatch(/This user already exists/i)
    })

    it('Should successfully create an new inspector', async () => {
      const response = await request(app)
        .post('/api/v1/companies/2/employees')
        .set('Cookie', cookie)
        .send({
          email: 'www.smith@mail.com',
          first_name: 'Jerry',
          last_name: 'Smith',
          city_id: 1
        })

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        id: expect.any(Number),
        account_id: expect.any(Number),
        email: 'www.smith@mail.com',
        role: 'manager',
        first_name: 'Jerry',
        last_name: 'Smith',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        city: 'Moscow',
        phone_number: ''
      })
    })
  })

  describe('GET: /companies/{companyId}/employees', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/1/employees')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/5/employees')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a list of company employees', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/employees')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.employees).toEqual([
        {
          id: 3,
          account_id: 15,
          email: 'www.morello@mail.com',
          role: 'manager',
          first_name: 'Sergio',
          last_name: 'Morello',
          created_at: expect.any(String),
          updated_at: expect.any(String),
          city: 'Rostov-on-Don',
          phone_number: '+12225555521'
        },
        {
          id: 2,
          account_id: 14,
          email: 'www.miller@mail.com',
          role: 'manager',
          first_name: 'Joe',
          last_name: 'Miller',
          created_at: expect.any(String),
          updated_at: expect.any(String),
          city: 'Saint Petersburg',
          phone_number: '+14445555521'
        },
        {
          id: 1,
          account_id: 3,
          email: 'www.bob@mail.com',
          role: 'manager',
          first_name: 'Bob',
          last_name: 'Fox',
          created_at: expect.any(String),
          updated_at: expect.any(String),
          city: 'Yekaterinburg',
          phone_number: '+17775555521'
        }
      ])
    })
  })

  describe('GET: /companies/{companyId}/employees/{employeeId}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/1/employees/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .get('/api/v1/companies/5/employees/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return the status not found', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/employees/4')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return information about a company employee', async () => {
      const response = await request(app)
        .get('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: expect.any(Number),
        account_id: expect.any(Number),
        email: 'www.bob@mail.com',
        role: 'manager',
        first_name: 'Bob',
        last_name: 'Fox',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        city: 'Yekaterinburg',
        phone_number: '+17775555521'
      })
    })
  })

  describe('PUT: /companies/{companyId}/employees/{employeeId}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .put('/api/v1/companies/1/employees/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/5/employees/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a data validation error (invalid types)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)
        .send({
          first_name: null,
          last_name: null,
          city_id: null,
          phone_number: null
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/first_name',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/last_name',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be number'
          }),
          expect.objectContaining({
            instancePath: '/phone_number',
            message: 'must be string'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)
        .send({
          first_name: 'Roooooooooooooman',
          last_name: 'Maaaaaaaaaaaaaaaaaaaartin',
          city_id: 1,
          phone_number: '+1555522223451234'
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/first_name',
            message: 'must NOT have more than 16 characters'
          }),
          expect.objectContaining({
            instancePath: '/last_name',
            message: 'must NOT have more than 24 characters'
          }),
          expect.objectContaining({
            instancePath: '/phone_number',
            message: 'must NOT have more than 16 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)
        .send({
          first_name: 'Th',
          last_name: 'Ma',
          city_id: -1,
          phone_number: '+1555223310'
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/first_name',
            message: 'must NOT have fewer than 3 characters'
          }),
          expect.objectContaining({
            instancePath: '/last_name',
            message: 'must NOT have fewer than 3 characters'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be >= 1'
          })
        ])
      )
    })

    it('should return the status city not found', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)
        .send({
          first_name: 'Thomas',
          last_name: 'Martin',
          city_id: 100,
          phone_number: '+15550003322'
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.error).toMatch(/City is not found/i)
    })

    it('should return the status employee not found', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/employees/4')
        .set('Cookie', cookie)
        .send({
          first_name: 'Thomas',
          last_name: 'Martin',
          city_id: 1,
          phone_number: '+15550003322'
        })

      expect(response.statusCode).toBe(404)
    })

    it('should return updated company employee data', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)
        .send({
          first_name: 'Thomas',
          last_name: 'Martin',
          city_id: 6,
          phone_number: '+15550003322'
        })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        account_id: 3,
        email: 'www.bob@mail.com',
        role: 'manager',
        first_name: 'Thomas',
        last_name: 'Martin',
        created_at: expect.any(String),
        updated_at: expect.any(String),
        city: 'Kazan',
        phone_number: '+15550003322'

      })
    })
  })

  describe('DELETE: /companies/{companyId}/employees/{employeeId}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/1/employees/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/5/employees/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return the status employee not found', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/2/employees/4')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return no content status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/2/employees/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(204)
    })
  })
})
