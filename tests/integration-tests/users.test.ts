import request from 'supertest'
import { app } from '../../source/app'

describe('Users endpoints:', () => {
  const SIGN_IN_URL = '/api/v1/auth/sign-in'

  const USER_LOGIN_PAYLOAD = {
    email: 'www.jhon@mail.com',
    password: 'Qwerty1234'
  }

  describe('GET: /users', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/users')

      expect(response.statusCode).toBe(401)
    })

    it('should return a list of users', async () => {
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const userResponse = await request(app).get('/api/v1/users')
        .set('Cookie', cookies)

      expect(userResponse.statusCode).toBe(200)
      expect(userResponse.body.users.length).toBe(17)
      expect(userResponse.body.users).toEqual(
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
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users?role=inspector')
        .set('Cookie', cookies)

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
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users?role=administrator')
        .set('Cookie', cookies)

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
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users?role=manager')
        .set('Cookie', cookies)

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

  describe('GET: /users/{user_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/users/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return the message invalid parameter', async () => {
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      {
        const response = await request(app)
          .get('/api/v1/users/NaN')
          .set('Cookie', cookies)

        expect(response.statusCode).toBe(400)
      }

      {
        const response = await request(app)
          .get('/api/v1/users/-1')
          .set('Cookie', cookies)

        expect(response.statusCode).toBe(400)
      }
    })

    it('should return status not found', async () => {
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users/100')
        .set('Cookie', cookies)

      expect(response.statusCode).toBe(404)
      expect(response.body).toMatchObject({
        message: 'Account is not found.'
      })
    })

    it('should return inspector profile data', async () => {
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users/1')
        .set('Cookie', cookies)

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
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users/2')
        .set('Cookie', cookies)

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
      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send(USER_LOGIN_PAYLOAD)

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      const response = await request(app).get('/api/v1/users/3')
        .set('Cookie', cookies)

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
