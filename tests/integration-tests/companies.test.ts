import request from 'supertest'
import { app } from '../../source/app'

describe('Companies endpoints:', () => {
  describe('GET: /companies', () => {
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

    it('should return the status not authorized', async () => {
      const response = await request(app).get('/api/v1/companies')
      expect(response.statusCode).toBe(401)
    })

    it('should return the company list', async () => {
      const response = await request(app)
        .get('/api/v1/companies')
        .set('Cookie', cookie)

      expect(response.body.companies).toEqual([
        {
          id: 1,
          name: 'Модный кабачок',
          description: 'Сеть ресторанов',
          website_link: null,
          vk_link: null
        },
        {
          id: 2,
          name: 'Res-O-Run',
          description: 'Сеть ресторанов',
          website_link: null,
          vk_link: null
        },
        {
          id: 3,
          name: 'Bosco',
          description: 'Сеть ресторанов',
          website_link: null,
          vk_link: null
        }
      ])
    })
  })

  describe('GET: /companies/{company_id}', () => {
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

    it('should return the status not authorized', async () => {
      const response = await request(app).get('/api/v1/companies/1')
      expect(response.statusCode).toBe(401)
    })

    it('should return the status not found', async () => {
      const response = await request(app)
        .get('/api/v1/companies/100')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return the company info', async () => {
      const response = await request(app)
        .get('/api/v1/companies/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        name: 'Модный кабачок',
        description: 'Сеть ресторанов',
        vk_link: null,
        website_link: null,
        administrator: {
          id: 1,
          first_name: 'Jane',
          last_name: 'Fox',
          phone_number: null
        }
      })
    })
  })

  describe('PUT: /companies/{company_id}', () => {
    let cookie = ''

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/v1/auth/sign-in')
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      cookie = response.headers['set-cookie']
    })

    afterAll(async () => {
      await request(app).delete('/api/v1/sign-out')
      cookie = ''
    })

    it('should return the status not authorized', async () => {
      const response = await request(app).put('/api/v1/companies/1')
      expect(response.statusCode).toBe(401)
    })

    it('should return forbidden status', async () => {
      const response = await request(app)
        .put('/api/v1/companies/2')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(403)
    })

    it('should return a data validation error (invalid types)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/1')
        .set('Cookie', cookie)
        .send({
          name: null,
          description: null,
          website_link: null,
          vk_link: null,
          number_of_checks: null
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/description',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/website_link',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/number_of_checks',
            message: 'must be number'
          })
        ])
      )
    })

    it('should return a data validation error (maximum number of characters in lines)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/1')
        .set('Cookie', cookie)
        .send({
          name: 'ZuKdKXlGgNndVHxahUYmZUMKltdObPtVV',
          description: 'C4lFH4ehLIS4vcaKdqFQUlamMAqvq5I7xpojRJmCQ8ozPudAjz73OUC5I27pks6Yfhwz3AmDOtuWGCOMZX6w4YuzzC2',
          website_link: 'C4lFH4ehLIS4vcaKdqFQUlamMAqvq5I7xpojRJmCQ8ozPudAjz73OUC5I27pks6Yfhwz3AmDOtuWGCOMZX6w4YuzzC2',
          vk_link: 'C4lFH4ehLIS4vcaKdqFQUlamMAqvq5I7xpojRJmCQ8ozPudAjz73OUC5I27pks6Yfhwz3AmDOtuWGCOMZX6w4YuzzC2',
          number_of_checks: 0
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have more than 32 characters'
          }),
          expect.objectContaining({
            instancePath: '/description',
            message: 'must NOT have more than 90 characters'
          }),
          expect.objectContaining({
            instancePath: '/website_link',
            message: 'must NOT have more than 90 characters'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must NOT have more than 90 characters'
          })
        ])
      )
    })

    it('should return a data validation error (minimum number of characters in lines)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/1')
        .set('Cookie', cookie)
        .send({
          name: '',
          description: '',
          website_link: '',
          vk_link: '',
          number_of_checks: 0
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/name',
            message: 'must NOT have fewer than 5 characters'
          })
        ])
      )
    })

    it('should return a data validation error (invalid data format)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/1')
        .set('Cookie', cookie)
        .send({
          name: 'Bosco Cafe',
          description: 'Simple cafe',
          website_link: 'localhost3000',
          vk_link: 'http://vk.com',
          number_of_checks: 0
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must match pattern "^https://vk\\.com"'
          }),
          expect.objectContaining({
            instancePath: '/website_link',
            message: 'must match format "uri"'
          })
        ])
      )
    })

    it('should successfully update company profile', async () => {
      const payload = {
        name: 'Bosco Cafe',
        description: 'Simple cafe',
        website_link: 'http://localhost:8080',
        vk_link: 'https://vk.com/bosco_cafe',
        number_of_checks: 0
      }

      const response = await request(app)
        .put('/api/v1/companies/1')
        .set('Cookie', cookie)
        .send(payload)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        ...payload,
        id: 1,
        number_of_checks: null
      })
    })
  })
})
