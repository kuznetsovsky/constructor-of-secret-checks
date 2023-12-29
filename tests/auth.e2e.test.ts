import request from 'supertest'
import { app } from '../source/app'

describe('Auth endpoint', () => {
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
})
