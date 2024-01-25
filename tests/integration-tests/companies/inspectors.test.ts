import request from 'supertest'
import { app } from '../../../source/app'

describe('Company inspectors endpoints:', () => {
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

  describe('POST: /companies/inspectors', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')

      expect(response.statusCode).toBe(401)
    })

    it('should return a data validation error (invalid types)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: null,
          first_name: null,
          last_name: null,
          city_id: null,
          phone_number: null,
          birthday: null,
          address: null,
          vk_link: null
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
            instancePath: '/phone_number',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be number'
          }),
          expect.objectContaining({
            instancePath: '/address',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/birthday',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must be string'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: 'www.thooooooomasssssssss@mail.com',
          first_name: 'Roooooooooooooman',
          last_name: 'Maaaaaaaaaaaaaaaaaaaartin',
          phone_number: '+1999223355565431',
          address: 'wpZouc3u6shP94j8gWmEF85tCpb66WyVDfk25zMxw3p8B4Vodj3NTtcUsh0ad',
          vk_link: '6oX466BKZqAMujrDcBrUQBe6MdunYuacVgP5t1ocM6ztqzu8D',
          city_id: 1,
          birthday: '01-02-2013'
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
          }),
          expect.objectContaining({
            instancePath: '/phone_number',
            message: 'must NOT have more than 16 characters'
          }),
          expect.objectContaining({
            instancePath: '/address',
            message: 'must NOT have more than 60 characters'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must NOT have more than 48 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Th',
          last_name: 'Ma',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/roman',
          city_id: -1,
          birthday: '2012-01-01'
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
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomasmail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'roman',
          city_id: 1,
          birthday: '01-01-2011'
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/email',
            message: 'must match format "email"'
          }),
          expect.objectContaining({
            instancePath: '/birthday',
            message: 'must match format "date"'
          }),
          expect.objectContaining({
            instancePath: '/birthday',
            message: 'should be >= 2000-01-01'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must match pattern "^https://vk\\.com"'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must match format "uri"'
          })
        ])
      )
    })

    it('should return the status city not found', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/thomas',
          city_id: 100,
          birthday: '2011-01-01'
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.message).toMatch(/City is not found/i)
    })

    it('should return the status with such an email exists inspector', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: 'www.jhon@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/thomas',
          city_id: 1,
          birthday: '2011-01-01'
        })

      expect(response.statusCode).toBe(409)
      expect(response.body.message).toMatch(/An inspector with the same email already exists/i)
    })

    it('should successfully create a company inspector (new inspector)', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/thomas',
          city_id: 1,
          birthday: '2011-01-01'
        })

      expect(response.statusCode).toBe(201)
      expect(response.headers.location).toMatch('/companies/2/inspectors')
      expect(response.body).toEqual({
        id: 10,
        account_id: expect.any(Number),
        inspector_id: 10,
        status: 'verification',
        email: 'www.thomas@mail.com',
        first_name: 'Thomas',
        last_name: 'Martin',
        phone_number: '+19992233555',
        address: 'Central Street',
        birthday: '2010-12-31T21:00:00.000Z',
        vk_link: 'https://vk.com/thomas',
        city: {
          id: 1,
          name: 'Moscow'
        },
        note: null,
        created_at: expect.any(String)
      })
    })
  })

  describe('POST: /companies/inspectors/{email}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors/www.ex@mple.com')

      expect(response.statusCode).toBe(401)
    })

    it('should return the status "not found"', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors/www.ex@mple.com')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return cannot be assigned as inspector', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors/www.jane@mail.com')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(400)
    })

    it('should return status 200', async () => {
      const response = await request(app)
        .post('/api/v1/companies/inspectors/www.tim@mail.com')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('GET: /companies/inspectors', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors')

      expect(response.statusCode).toBe(401)
    })

    it('should successfully return a list of company inspectors', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.inspectors).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            account_id: 1,
            inspector_id: 1,
            phone_number: '+15555555521',
            status: 'verification',
            email: 'www.jhon@mail.com',
            first_name: 'John',
            last_name: 'Fox',
            city: {
              id: 6,
              name: 'Kazan'
            }
          })
        ])
      )
    })

    it('should return status city is not found', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors?city=Karaganda')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
      expect(response.body.message).toMatch(/City is not found/i)
    })

    it('should return an empty array', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors?city=Sochi')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.inspectors.length).toBe(0)
      expect(response.body.inspectors).toEqual([])
    })

    it('should return a list of company inspectors whose last names begin with "Fo"', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors?surname=Fo')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body.inspectors.length).toBe(6)
      expect(response.body.inspectors).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            account_id: 1,
            inspector_id: 1,
            status: 'verification',
            email: 'www.jhon@mail.com',
            first_name: 'John',
            last_name: 'Fox',
            phone_number: '+15555555521',
            city: {
              id: 6,
              name: 'Kazan'
            }
          }),
          expect.objectContaining({
            id: 3,
            account_id: 7,
            inspector_id: 3,
            status: 'verification',
            email: 'www.lana@mail.com',
            first_name: 'Lana',
            last_name: 'Fox',
            phone_number: null,
            city: null
          }),
          expect.objectContaining({
            id: 5,
            account_id: 9,
            inspector_id: 5,
            status: 'approved',
            email: 'www.barbara@mail.com',
            first_name: 'Barbara',
            last_name: 'Ford',
            phone_number: null,
            city: {
              id: 7,
              name: 'Rostov-on-Don'
            }
          }),
          expect.objectContaining({
            id: 7,
            account_id: 11,
            inspector_id: 7,
            status: 'verification',
            email: 'www.betty@mail.com',
            first_name: 'Betty',
            last_name: 'Fox',
            phone_number: null,
            city: {
              id: 4,
              name: 'Yekaterinburg'
            }
          }),
          expect.objectContaining({
            id: 8,
            account_id: 12,
            inspector_id: 8,
            status: 'deviation',
            email: 'www.boris@mail.com',
            first_name: 'Boris',
            last_name: 'Lafox',
            phone_number: null,
            city: {
              id: 5,
              name: 'Nizhny Novgorod'
            }
          }),
          expect.objectContaining({
            id: 9,
            account_id: 13,
            inspector_id: 9,
            status: 'approved',
            email: 'www.michael@mail.com',
            first_name: 'Michael',
            last_name: 'Deford',
            phone_number: null,
            city: {
              id: 1,
              name: 'Moscow'
            }
          })
        ])
      )
    })
  })

  describe('GET: /companies/inspectors/{inspector_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return the status "not found"', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors/2')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
      expect(response.body.message).toMatch(/Inspector is not found/i)
    })

    it('should return inspector profile by id 1', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        account_id: 1,
        inspector_id: 1,
        status: 'verification',
        email: 'www.jhon@mail.com',
        first_name: 'John',
        last_name: 'Fox',
        phone_number: '+15555555521',
        address: null,
        birthday: null,
        vk_link: null,
        city: {
          id: 6,
          name: 'Kazan'
        },
        note: 'Замечаний нетю',
        created_at: '2024-01-15T12:18:39.984Z'
      })
    })
  })

  describe('GET: /companies/inspectors/{email}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors/www.ex@mple.com')

      expect(response.statusCode).toBe(401)
    })

    it('should return the status "not found"', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors/www.ex@mple.com')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return status 200', async () => {
      const response = await request(app)
        .get('/api/v1/companies/inspectors/www.jane@mail.com')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('PUT: /companies/inspectors/{inspector_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return a data validation error (invalid types)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({
          email: null,
          first_name: null,
          last_name: null,
          city_id: null,
          phone_number: null,
          birthday: null,
          address: null,
          vk_link: null,
          note: null
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
            instancePath: '/phone_number',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/city_id',
            message: 'must be number'
          }),
          expect.objectContaining({
            instancePath: '/address',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/birthday',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/note',
            message: 'must be string'
          })
        ])
      )
    })

    it('should return a failed check status (checking maximum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({
          email: 'www.thooooooomasssssssss@mail.com',
          first_name: 'Roooooooooooooman',
          last_name: 'Maaaaaaaaaaaaaaaaaaaartin',
          phone_number: '+1999223355565431',
          address: 'wpZouc3u6shP94j8gWmEF85tCpb66WyVDfk25zMxw3p8B4Vodj3NTtcUsh0ad',
          vk_link: '6oX466BKZqAMujrDcBrUQBe6MdunYuacVgP5t1ocM6ztqzu8D',
          city_id: 1,
          birthday: '01-02-2013',
          note: 'x96ZMbOeuW4nzQN7RHsQtuM4vfRDcvdedz26z7Z7sejnAAcPCXzn9StnOV7TBrKQGubnsRFoC4Jsg1Rb9SPrg6qsHqJ'
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
          }),
          expect.objectContaining({
            instancePath: '/phone_number',
            message: 'must NOT have more than 16 characters'
          }),
          expect.objectContaining({
            instancePath: '/address',
            message: 'must NOT have more than 60 characters'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must NOT have more than 48 characters'
          }),
          expect.objectContaining({
            instancePath: '/note',
            message: 'must NOT have more than 90 characters'
          })
        ])
      )
    })

    it('should return a failed check status (checking minimum values)', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Th',
          last_name: 'Ma',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/roman',
          city_id: -1,
          birthday: '2012-01-01',
          note: 'Нет.'
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
        .put('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomasmail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'roman',
          city_id: 1,
          birthday: '01-01-2011',
          note: 'No'
        })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/email',
            message: 'must match format "email"'
          }),
          expect.objectContaining({
            instancePath: '/birthday',
            message: 'must match format "date"'
          }),
          expect.objectContaining({
            instancePath: '/birthday',
            message: 'should be >= 2000-01-01'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must match pattern "^https://vk\\.com"'
          }),
          expect.objectContaining({
            instancePath: '/vk_link',
            message: 'must match format "uri"'
          })
        ])
      )
    })

    it('should return the status city not found', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/thomas',
          city_id: 100,
          birthday: '2011-01-01',
          note: ''
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.message).toMatch(/City is not found/i)
    })

    it('should return the status inspector not found', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/2')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/thomas',
          city_id: 1,
          birthday: '2011-01-01',
          note: ''
        })

      expect(response.statusCode).toBe(404)
      expect(response.body.message).toMatch(/Inspector is not found/i)
    })

    it('should return successfully updated inspector data', async () => {
      const response = await request(app)
        .put('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({
          email: 'www.thomas@mail.com',
          first_name: 'Thomas',
          last_name: 'Martin',
          phone_number: '+19992233555',
          address: 'Central Street',
          vk_link: 'https://vk.com/thomas',
          city_id: 1,
          birthday: '2011-01-01',
          note: ''
        })

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        id: 1,
        account_id: 1,
        inspector_id: 1,
        status: 'verification',
        email: 'www.thomas@mail.com',
        first_name: 'Thomas',
        last_name: 'Martin',
        phone_number: '+19992233555',
        address: 'Central Street',
        birthday: '2010-12-31T21:00:00.000Z',
        vk_link: 'https://vk.com/thomas',
        city: {
          id: 1,
          name: 'Moscow'
        },
        note: '',
        created_at: expect.any(String)
      })
    })
  })

  describe('PATCH: /companies/inspectors/{inspector_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/inspectors/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return a data validation error', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({ status: null })

      expect(response.statusCode).toBe(422)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/status',
            message: 'must be string'
          }),
          expect.objectContaining({
            instancePath: '/status',
            params: { allowedValues: ['verification', 'approved', 'deviation'] },
            message: 'must be equal to one of the allowed values'
          })
        ])
      )
    })

    it('should return the status unmodified', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({ status: 'verification' })

      expect(response.statusCode).toBe(304)
    })

    it('should return status updated successfully', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)
        .send({ status: 'approved' })

      expect(response.statusCode).toBe(200)
      expect(response.body.message).toMatch(/status updated successfully/i)
    })
  })

  describe('DELETE: /companies/inspectors/{inspector_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/inspectors/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return the status "not found"', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/inspectors/2')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(404)
      expect(response.body.message).toMatch(/Inspector is not found/i)
    })

    it('should successfully remove the inspector', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/inspectors/1')
        .set('Cookie', cookie)

      expect(response.statusCode).toBe(204)
    })
  })
})
