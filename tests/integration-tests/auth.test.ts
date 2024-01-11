import request from 'supertest'
import { app } from '../../source/app'
import { redis } from '../../source/connection'

describe('Auth endpoints:', () => {
  describe('POST: /auth/sign-up/company', () => {
    test('should return the id of the created user', async () => {
      const payload = {
        name: 'Моя кофешка',
        email: 'cofeshka@mail.com',
        password: 'qwerty123'
      }

      const response = await request(app)
        .post('/api/v1/auth/sign-up/company')
        .send(payload)

      expect(response.status).toEqual(201)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.headers.location).toMatch(/api\/v1\/accounts/)
      expect(response.body.id).toStrictEqual(expect.any(Number))
    })

    test.each([
      {
        name: 'Сеть рестаранов',
        email: 'www.example@mail.com',
        password: 'qwerty' // <---
      },
      {
        // <---
        email: 'www.example@mail.com',
        password: 'qwerty12345'
      },
      {
        name: 'Сеть рестаранов',
        email: 'www.example.com', // <---
        password: 'qwerty12345'
      },
      {
        name: 'Сеть рестаранов',
        email: 'www.example@mail.com',
        pasword: 'qwerty12345' // <---
      }
    ])('should return a validation error', async (payload) => {
      const response = await request(app)
        .post('/api/v1/auth/sign-up/company')
        .send(payload)

      expect(response.status).toEqual(422)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/Validation failed/i)
    })

    test.each([
      {
        conflict: 'name is already registered.',
        name: 'Модный кабачок',
        email: 'www.modkab@mail.com',
        password: 'qwerty_12345'
      },
      {
        conflict: 'email already exists.',
        name: 'Травим дорого',
        email: 'www.jhon@mail.com',
        password: 'qwerty_12345'
      }
    ])('should return a conflict message', async (payload) => {
      const response = await request(app)
        .post('/api/v1/auth/sign-up/company')
        .send(payload)

      expect(response.status).toEqual(409)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(payload.conflict)
    })
  })

  describe('POST: /auth/sign-up/inspector', () => {
    const URL = '/api/v1/auth/sign-up/inspector'

    test('should return the id of the created user', async () => {
      const payload = {
        first_name: 'Alex',
        last_name: 'Fox',
        email: 'a.fox@mail.com',
        password: 'qwerty123'
      }

      const response = await request(app).post(URL).send(payload)

      expect(response.status).toEqual(201)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.headers.location).toMatch(/api\/v1\/accounts/)
      expect(response.body.id).toStrictEqual(expect.any(Number))
    })

    test.each([
      {
        fisrt_name: 'Alex',
        last_name: 'Fox',
        email: 'www.a.fox@mail.com',
        password: 'qwerty' // <---
      },
      {
        // <---
        email: 'www.a.fox@mail.com',
        password: 'qwerty12345'
      },
      {
        fisrt_name: 'Alex',
        last_name: 'Fox',
        email: 'www.a.foxmail.com', // <---
        password: 'qwerty12345'
      },
      {
        fisrt_name: 'Alex',
        last_name: 'Fox',
        email: 'www.example@mail.com',
        pasword: 'qwerty12345' // <---
      }
    ])('should return a validation error', async (payload) => {
      const response = await request(app).post(URL).send(payload)

      expect(response.status).toEqual(422)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/Validation failed/i)
    })

    test('should return a conflict message', async () => {
      const payload = {
        first_name: 'Bob',
        last_name: 'Fox',
        email: 'www.bob@mail.com', // <--
        password: 'qwerty123'
      }

      const response = await request(app).post(URL).send(payload)

      expect(response.status).toEqual(409)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/email already exists./i)
    })
  })

  describe('POST: /auth/sign-in', () => {
    const URL = '/api/v1/auth/sign-in'

    test.each([
      {
        case: 'wrong password',
        email: 'www.example@mail.com',
        password: 'qwerty'
      },
      {
        case: 'no required fields',
        email: 'www.example@mail.com'
      },
      {
        case: 'invalid mail',
        email: 'www.examplemail.com',
        password: 'qwerty12345'
      }
    ])('should return a validation error ($case)', async (payload) => {
      const response = await request(app).post(URL).send(payload)

      expect(response.status).toEqual(422)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/Validation failed/i)
    })

    test.each([
      {
        case: 'account not found',
        email: 'www.example@mail.com',
        password: 'Qwerty123'
      },
      {
        case: 'account unverified',
        email: 'www.tim@mail.com',
        password: 'Qwerty_1234'
      }
    ])('should return 401 status code ($case)', async (payload) => {
      const response = await request(app).post(URL).send({
        email: payload.email,
        password: payload.password
      })

      expect(response.status).toEqual(401)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/The user was not found with these login details or the account was not verified./i)
    })

    test.each([
      {
        role: 'inspector',
        email: 'www.jhon@mail.com',
        password: 'Qwerty1234'
      },
      {
        role: 'administrator',
        email: 'www.jane@mail.com',
        password: 'Qwerty_1234'
      }
      // TODO: сделать, когда будет функционал...
      // {
      //   role: 'manager',
      //   email: 'www.bob@mail.com',
      //   password: '!Qwerty1234'
      // }
    ])('should return account profile data ($role)', async (payload) => {
      const response = await request(app).post(URL).send({
        email: payload.email,
        password: payload.password
      })

      expect(response.status).toEqual(200)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        role: payload.role,
        email: payload.email,
        first_name: expect.any(String),
        last_name: expect.any(String)
      })

      if (response.body.role === 'manager' || response.body.role === 'administrator') {
        expect(response.body.company).toEqual({
          id: expect.any(Number),
          name: expect.any(String)
        })
      }
    })

    test('should limit authorization attempts after 3 attempts', async () => {
      const USER_LOGIN_DATA = {
        email: 'www.jhon@mail.com',
        password: '!Qwerty1234'
      }

      for (let i = 0; i < 3; i++) {
        const loginResponse = await request(app)
          .post(URL)
          .send(USER_LOGIN_DATA)

        expect(loginResponse.statusCode).toBe(401)
        expect(loginResponse.body).toMatchObject({
          message: /The user was not found with these login details or the account was not verified./i
        })
      }

      {
        const loginResponse = await request(app)
          .post(URL)
          .send(USER_LOGIN_DATA)

        expect(loginResponse.statusCode).toBe(401)
        expect(loginResponse.body).toMatchObject({
          error: /Authorization attempts exceeded. Repeat after 15 minutes./i
        })
      }

      {
        await redis.flushall()
        const loginResponse = await request(app)
          .post(URL)
          .send(USER_LOGIN_DATA)

        expect(loginResponse.statusCode).toBe(401)
        expect(loginResponse.body).toMatchObject({
          message: /The user was not found with these login details or the account was not verified./i
        })
      }
    })
  })
})
