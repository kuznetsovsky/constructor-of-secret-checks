import request from 'supertest'
import { app } from '../../source/app'

describe('When a client sends request to', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const EMPLOYEES_URL = '/api/v1/companies/employees'

  let adminCookie = ''
  let inspectorCookie = ''
  let managerCookie = ''

  beforeAll(async () => {
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.alex@mail.com',
          password: 'Qwerty1234'
        })

      adminCookie = response.headers['set-cookie']
    }
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.jhon@mail.com',
          password: 'Qwerty1234'
        })

      inspectorCookie = response.headers['set-cookie']
    }
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.bob@mail.com',
          password: '!Qwerty1234'
        })

      managerCookie = response.headers['set-cookie']
    }
  })

  afterAll(async () => {
    await request(app).delete(LOGOUT_URL)
    adminCookie = ''
    inspectorCookie = ''
    managerCookie = ''
  })

  describe(`POST: ${EMPLOYEES_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(EMPLOYEES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(EMPLOYEES_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return the status city not found', async () => {
          const response = await request(app)
            .post(EMPLOYEES_URL)
            .set('Cookie', adminCookie)
            .send({
              email: 'www.thomas@mail.com',
              first_name: 'Thomas',
              last_name: 'Martin',
              city_id: 100
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should return conflict status', async () => {
          const response = await request(app)
            .post(EMPLOYEES_URL)
            .set('Cookie', adminCookie)
            .send({
              email: 'www.jhon@mail.com',
              first_name: 'Thomas',
              last_name: 'Martin',
              city_id: 1
            })

          expect(response.statusCode).toBe(409)
          expect(response.body.message).toMatch(/This user already exists/i)
        })

        it('should successfully create an new inspector', async () => {
          const response = await request(app)
            .post(EMPLOYEES_URL)
            .set('Cookie', adminCookie)
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

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .post(EMPLOYEES_URL)
            .set('Cookie', managerCookie)
            .send({
              email: 'www.smith@mail.com',
              first_name: 'Jerry',
              last_name: 'Smith',
              city_id: 1
            })

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .post(EMPLOYEES_URL)
            .set('Cookie', inspectorCookie)
            .send({
              email: 'www.smith@mail.com',
              first_name: 'Jerry',
              last_name: 'Smith',
              city_id: 1
            })

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${EMPLOYEES_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(EMPLOYEES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return a list of company employees', async () => {
          const response = await request(app)
            .get(EMPLOYEES_URL)
            .set('Cookie', adminCookie)

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

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(EMPLOYEES_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(EMPLOYEES_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${EMPLOYEES_URL}/{employee_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${EMPLOYEES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status bad request', async () => {
          const response = await request(app)
            .get(`${EMPLOYEES_URL}/NaN`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/i,
            errors: expect.any(Array)
          })
        })

        it('should return the status not found', async () => {
          const response = await request(app)
            .get(`${EMPLOYEES_URL}/4`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return information about a company employee', async () => {
          const response = await request(app)
            .get(`${EMPLOYEES_URL}/1`)
            .set('Cookie', adminCookie)

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

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${EMPLOYEES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${EMPLOYEES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PUT: ${EMPLOYEES_URL}/{employee_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(`${EMPLOYEES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status bad request', async () => {
          const response = await request(app)
            .put(`${EMPLOYEES_URL}/NaN`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/i,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .put(`${EMPLOYEES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return the status city not found', async () => {
          const response = await request(app)
            .put(`${EMPLOYEES_URL}/1`)
            .set('Cookie', adminCookie)
            .send({
              first_name: 'Thomas',
              last_name: 'Martin',
              city_id: 100,
              phone_number: '+15550003322'
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should return the status employee not found', async () => {
          const response = await request(app)
            .put(`${EMPLOYEES_URL}/4`)
            .set('Cookie', adminCookie)
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
            .put(`${EMPLOYEES_URL}/1`)
            .set('Cookie', adminCookie)
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

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(`${EMPLOYEES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(`${EMPLOYEES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`DELETE: ${EMPLOYEES_URL}/{employee_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).delete(EMPLOYEES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status bad request', async () => {
          const response = await request(app)
            .delete(`${EMPLOYEES_URL}/NaN`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/i,
            errors: expect.any(Array)
          })
        })

        it('should return the status employee not found', async () => {
          const response = await request(app)
            .delete(`${EMPLOYEES_URL}/4`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${EMPLOYEES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(204)
        })
      })
    })

    describe('and with manager role', () => {
      it('should return status forbidden', async () => {
        const response = await request(app)
          .delete(`${EMPLOYEES_URL}/1`)
          .set('Cookie', managerCookie)

        expect(response.statusCode).toBe(403)
      })
    })

    describe('and with inspector role', () => {
      it('should return status forbidden', async () => {
        const response = await request(app)
          .delete(`${EMPLOYEES_URL}/1`)
          .set('Cookie', inspectorCookie)

        expect(response.statusCode).toBe(403)
      })
    })
  })
})
