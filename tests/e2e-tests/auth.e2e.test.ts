import request from 'supertest'
import { app } from '../../source/app'

const LOGIN_URL = '/api/v1/auth/sign-in'
const REGISTER_INSPECTOR_URL = '/api/v1/auth/sign-up/inspector'
const REGISTER_COMPANY_URL = '/api/v1/auth/sign-up/company'

describe('When a client', () => {
  describe(`sends a request to POST: ${REGISTER_COMPANY_URL}`, () => {
    it('should return a validation error', async () => {
      const response = await request(app).post(REGISTER_COMPANY_URL)
      expect(response.statusCode).toBe(422)
    })

    it.each([
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
        .post(REGISTER_COMPANY_URL)
        .send(payload)

      expect(response.status).toEqual(409)
      expect(response.body.message).toMatch(payload.conflict)
    })

    it('should return the id of the created user', async () => {
      const payload = {
        name: 'Моя кофешка',
        email: 'cofeshka@mail.com',
        password: 'qwerty123'
      }

      const response = await request(app)
        .post(REGISTER_COMPANY_URL)
        .send(payload)

      expect(response.status).toEqual(201)
      expect(response.headers.location).toMatch(/api\/v1\/users/)
    })
  })

  describe(`sends a request to POST: ${REGISTER_INSPECTOR_URL}`, () => {
    it('should return a validation error', async () => {
      const response = await request(app).post(REGISTER_INSPECTOR_URL)
      expect(response.statusCode).toBe(422)
    })

    it('should return a conflict message', async () => {
      const payload = {
        first_name: 'Bob',
        last_name: 'Fox',
        email: 'www.bob@mail.com',
        password: 'qwerty123'
      }

      const response = await request(app).post(REGISTER_INSPECTOR_URL).send(payload)

      expect(response.status).toEqual(409)
      expect(response.body.message).toMatch(/email already exists./i)
    })

    it('should return the id of the created user', async () => {
      const payload = {
        first_name: 'Alex',
        last_name: 'Fox',
        email: 'a.fox@mail.com',
        password: 'qwerty123'
      }

      const response = await request(app)
        .post(REGISTER_INSPECTOR_URL)
        .send(payload)

      expect(response.status).toEqual(201)
      expect(response.headers.location).toMatch(/api\/v1\/users/)
    })
  })

  describe(`sends a request to POST: ${LOGIN_URL}`, () => {
    it('should return a validation error', async () => {
      const response = await request(app).post(LOGIN_URL)
      expect(response.statusCode).toBe(422)
    })

    it('should return a message about the unconfirmed email address', async () => {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.tim@mail.com',
          password: 'Qwerty_1234'
        })

      expect(response.statusCode).toBe(401)
      expect(response.body.message)
        .toMatch(/The user was not found with these login details or the account was not verified/i)
    })

    it.each([
      {
        role: 'inspector',
        email: 'www.jhon@mail.com',
        password: 'Qwerty1234'
      },
      {
        role: 'administrator',
        email: 'www.jane@mail.com',
        password: 'Qwerty_1234'
      },
      {
        role: 'manager',
        email: 'www.bob@mail.com',
        password: '!Qwerty1234'
      }
    ])('should return account profile data ($role)', async (payload) => {
      const response = await request(app).post(LOGIN_URL).send({
        email: payload.email,
        password: payload.password
      })

      expect(response.status).toEqual(200)
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

    it('should return limit authorization attempts', async () => {
      const payload = {
        email: 'www.jhon@mail.com',
        password: '!Qwerty1234'
      }

      for (let i = 0; i < 3; i++) {
        const loginResponse = await request(app).post(LOGIN_URL)
          .send(payload)

        expect(loginResponse.statusCode).toBe(401)
        expect(loginResponse.body.message)
          .toMatch(/The user was not found with these login details or the account was not verified./i)
      }

      {
        const response = await request(app)
          .post(LOGIN_URL)
          .send(payload)

        expect(response.statusCode).toBe(401)
        expect(response.body).toMatchObject({
          message: /Authorization attempts exceeded. Repeat after 15 minutes./i
        })
      }
    })
  })
})
