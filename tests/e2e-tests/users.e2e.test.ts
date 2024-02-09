import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const USERS_URL = '/api/v1/users'

  describe(`not authorized sends request to GET: ${USERS_URL}`, () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).get(USERS_URL)
      expect(response.statusCode).toBe(401)
    })
  })

  describe(`not authorized sends request to GET: ${USERS_URL}/{user_id}`, () => {
    it('should return the status not authorized', async () => {
      const response = await request(app).get(`${USERS_URL}/1`)
      expect(response.statusCode).toBe(401)
    })
  })

  describe('authorized sends request to', () => {
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

    describe(`GET: ${USERS_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app)
          .get(USERS_URL)

        expect(response.statusCode).toBe(401)
      })

      it('should return a list of users', async () => {
        const response = await request(app).get(USERS_URL)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body.users.length).toBe(17)
        expect(response.body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.jhon@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'administrator',
              email: 'www.jane@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.bob@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.tim@mail.com',
              email_verified: null,
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'administrator',
              email: 'www.alex@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'administrator',
              email: 'www.alice@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.lana@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.ketty@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.barbara@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.britney@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.betty@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.boris@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.michael@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.miller@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.morello@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.thomson@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.sanchez@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            })
          ])
        )
      })

      it('should return a list of users with only role inspector', async () => {
        const response = await request(app).get(`${USERS_URL}/?role=inspector`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body.users.length).toBe(9)
        expect(response.body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.jhon@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.tim@mail.com',
              email_verified: null,
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.lana@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.ketty@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.barbara@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.britney@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.betty@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.boris@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'inspector',
              email: 'www.michael@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            })
          ])
        )
      })

      it('should return a list of users with only role administrator', async () => {
        const response = await request(app).get(`${USERS_URL}/?role=administrator`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body.users.length).toBe(3)
        expect(response.body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              role: 'administrator',
              email: 'www.jane@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'administrator',
              email: 'www.alex@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'administrator',
              email: 'www.alice@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            })
          ])
        )
      })

      it('should return a list of users with only role manager', async () => {
        const response = await request(app).get(`${USERS_URL}/?role=manager`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body.users.length).toBe(5)
        expect(response.body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.bob@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.miller@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.morello@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.thomson@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            }),
            expect.objectContaining({
              id: expect.any(Number),
              role: 'manager',
              email: 'www.sanchez@mail.com',
              email_verified: expect.any(String),
              created_at: expect.any(String),
              last_visit: expect.any(String)
            })
          ])
        )
      })
    })

    describe(`GET: ${USERS_URL}/{user_id}`, () => {
      it('should return status not found', async () => {
        const response = await request(app)
          .get(`${USERS_URL}/100`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(404)
      })

      it('should return the status bad request', async () => {
        const response = await request(app)
          .get(`${USERS_URL}/NaN`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(400)
        expect(response.body).toMatchObject({
          type: 'params',
          message: /Validation failed/i,
          errors: expect.any(Array)
        })
      })

      it('should return inspector profile data', async () => {
        const response = await request(app)
          .get(`${USERS_URL}/1`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
          id: 1,
          role: 'inspector',
          email: 'www.jhon@mail.com',
          first_name: 'Jhon',
          last_name: 'Fox',
          birthday: null,
          vk_link: null,
          address: null,
          city: null
        })
      })

      it('should return administrator profile data', async () => {
        const response = await request(app)
          .get(`${USERS_URL}/2`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
          id: 2,
          role: 'administrator',
          email: 'www.jane@mail.com',
          first_name: 'Jane',
          last_name: 'Fox',
          company: {
            id: 1,
            name: 'Модный кабачок'
          }
        })
      })

      it('should return manager profile data', async () => {
        const response = await request(app)
          .get(`${USERS_URL}/3`)
          .set('Cookie', cookie)

        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          role: 'manager',
          email: 'www.bob@mail.com',
          first_name: 'Bob',
          last_name: 'Fox',
          company: {
            id: 2,
            name: 'Res-O-Run'
          },
          phone_number: '+17775555521'
        })
      })
    })
  })
})
