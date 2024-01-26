import request from 'supertest'
import { app } from '../../source/app'

describe('When a client sends request to', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const TYPES_URL = '/api/v1/companies/check-types'

  let adminCookie = ''
  let inspectorCookie = ''
  let managerCookie = ''

  beforeAll(async () => {
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
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

  describe(`POST: ${TYPES_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(TYPES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return a validation error', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return conflict status', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', adminCookie)
            .send({ name: 'Зал' })

          expect(response.statusCode).toBe(409)
        })

        it('should return created status', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', adminCookie)
            .send({ name: 'Объект' })

          expect(response.statusCode).toBe(201)
          expect(response.headers.location).toMatch(TYPES_URL)
          expect(response.body).toEqual({
            id: expect.any(Number),
            company_id: 1,
            name: 'Объект',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with manager role', () => {
        it('should return a validation error', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return conflict status', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', managerCookie)
            .send({ name: 'Доставка' })

          expect(response.statusCode).toBe(409)
        })

        it('should return created status', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', managerCookie)
            .send({ name: 'Объект' })

          expect(response.statusCode).toBe(201)
          expect(response.headers.location).toMatch(TYPES_URL)
          expect(response.body).toEqual({
            id: expect.any(Number),
            company_id: 2,
            name: 'Объект',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .post(TYPES_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${TYPES_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(TYPES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return a list of types of checks', async () => {
          const response = await request(app)
            .get(TYPES_URL)
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

      describe('and with manager role', () => {
        it('should return a list of types of checks', async () => {
          const response = await request(app)
            .get(TYPES_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.types).toEqual(
            expect.arrayContaining([
              expect.not.objectContaining({
                id: 1,
                name: 'Зал',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              }),
              expect.not.objectContaining({
                id: 2,
                name: 'Кухня',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              }),
              expect.not.objectContaining({
                id: 3,
                name: 'Доствака',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              }),
              expect.objectContaining({
                id: 4,
                name: 'Доставка',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              })
            ])
          )
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(TYPES_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${TYPES_URL}/{check_type_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${TYPES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .get(`${TYPES_URL}/4`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return check type with id 1', async () => {
          const response = await request(app)
            .get(`${TYPES_URL}/1`)
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

      describe('and with manager role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .get(`${TYPES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return check type with id 1', async () => {
          const response = await request(app)
            .get(`${TYPES_URL}/4`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 4,
            name: 'Доставка',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with inspctor role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${TYPES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PUT: ${TYPES_URL}/{check_type_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(`${TYPES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return a validation error', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/4`)
            .set('Cookie', adminCookie)
            .send({ name: 'Доставка' })

          expect(response.statusCode).toBe(404)
        })

        it('should successfully update check type', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/3`)
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

      describe('and with manager role', () => {
        it('should return a validation error', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/1`)
            .set('Cookie', managerCookie)
            .send({ name: 'Доставка' })

          expect(response.statusCode).toBe(404)
        })

        it('should successfully update check type', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/4`)
            .set('Cookie', managerCookie)
            .send({ name: 'Зал' })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 4,
            company_id: 2,
            name: 'Зал',
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(`${TYPES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`DELETE: ${TYPES_URL}/{check_type_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).delete(`${TYPES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .delete(`${TYPES_URL}/4`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${TYPES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with manager role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .delete(`${TYPES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${TYPES_URL}/4`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .delete(`${TYPES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
