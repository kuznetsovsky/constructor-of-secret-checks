import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const USER_URL = '/api/v1/user'
  const PASSWORD_URL = '/api/v1/user/change-password'

  describe('not authorized', () => {
    describe(`sends request to GET: ${USER_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(USER_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`sends request to PUT: ${USER_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(USER_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`sends request to PUT: ${PASSWORD_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(PASSWORD_URL)
        expect(response.statusCode).toBe(401)
      })
    })
  })

  describe('authorized with administrator role', () => {
    let adminCookie = ''

    beforeAll(async () => {
      const response = await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      adminCookie = response.headers['set-cookie']
    })

    afterAll(async () => {
      await request(app).delete(LOGOUT_URL)
      adminCookie = ''
    })

    describe(`sends request to GET: ${USER_URL}`, () => {
      it('should return administrator profile data', async () => {
        const response = await request(app)
          .get(USER_URL)
          .set('Cookie', adminCookie)

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
    })

    describe(`sends request to PUT: ${USER_URL}`, () => {
      it('should return validation failed status', async () => {
        const response = await request(app).put(USER_URL)
          .set('Cookie', adminCookie)

        expect(response.status).toEqual(422)
      })

      it('should successfully update administrator profile', async () => {
        const payload = {
          first_name: 'Marry',
          last_name: 'Doe',
          phone_number: '+15555551234'
        }

        const profileResponse = await request(app)
          .put(USER_URL)
          .set('Cookie', adminCookie)
          .send(payload)

        expect(profileResponse.statusCode).toBe(200)
        expect(profileResponse.body).toMatchObject({
          id: 2,
          role: 'administrator',
          email: 'www.jane@mail.com',
          company: {
            id: 1,
            name: 'Модный кабачок'
          },
          ...payload
        })
      })
    })

    describe(`sends request to PUT: ${PASSWORD_URL}`, () => {
      it('should return validation failed status', async () => {
        const response = await request(app).put(PASSWORD_URL)
          .set('Cookie', adminCookie)

        expect(response.status).toEqual(422)
      })

      it('should return the message old password does not match the current one', async () => {
        const response = await request(app).put(PASSWORD_URL)
          .set('Cookie', adminCookie)
          .send({
            old_password: 'Qwerty1234',
            new_password: '!Qwerty123',
            confirmation_new_password: '!Qwerty123'
          })

        expect(response.status).toEqual(400)
        expect(response.body.message).toMatch(/The old password does not match the current one/i)
      })

      it('should successfully update the password to a new one', async () => {
        const response = await request(app).put(PASSWORD_URL)
          .set('Cookie', adminCookie)
          .send({
            old_password: 'Qwerty_1234',
            new_password: '!Qwerty_1234',
            confirmation_new_password: '!Qwerty_1234'
          })

        expect(response.status).toEqual(200)
        expect(response.body.message).toMatch(/Password updated successfully/i)
      })
    })
  })

  describe('authorized with inspector role', () => {
    let inspectorCookie = ''

    beforeAll(async () => {
      const response = await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'www.jhon@mail.com',
          password: 'Qwerty1234'
        })

      inspectorCookie = response.headers['set-cookie']
    })

    afterAll(async () => {
      await request(app).delete(LOGOUT_URL)
      inspectorCookie = ''
    })

    describe(`sends request to GET: ${USER_URL}`, () => {
      it('should return inspector profile data', async () => {
        const response = await request(app)
          .get(USER_URL)
          .set('Cookie', inspectorCookie)

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
    })

    describe(`sends request to PUT: ${USER_URL}`, () => {
      it('should return validation failed status', async () => {
        const response = await request(app).put(USER_URL)
          .set('Cookie', inspectorCookie)

        expect(response.status).toEqual(422)
      })

      it('should successfully update inspector profile', async () => {
        const payload = {
          first_name: 'John',
          last_name: 'Morello',
          birthday: '2012-10-11',
          vk_link: 'https://vk.com/jmorello',
          address: 'Центральная, 9A',
          phone_number: '+1999555123'
        }

        const profileResponse = await request(app)
          .put(USER_URL)
          .set('Cookie', inspectorCookie)
          .send({
            city_id: 1,
            ...payload
          })

        expect(profileResponse.statusCode).toBe(200)
        expect(profileResponse.body).toMatchObject({
          ...payload,
          id: 1,
          role: 'inspector',
          email: 'www.jhon@mail.com',
          city: {
            id: 1,
            name: 'Moscow'
          },
          birthday: '2012-10-10T20:00:00.000Z'
        })
      })
    })

    describe(`sends request to PUT: ${PASSWORD_URL}`, () => {
      it('should return validation failed status', async () => {
        const response = await request(app).put(PASSWORD_URL)
          .set('Cookie', inspectorCookie)

        expect(response.status).toEqual(422)
      })

      it('should return the message old password does not match the current one', async () => {
        const response = await request(app).put(PASSWORD_URL)
          .set('Cookie', inspectorCookie)
          .send({
            old_password: 'Qwerty_1234',
            new_password: '!Qwerty123',
            confirmation_new_password: '!Qwerty123'
          })

        expect(response.status).toEqual(400)
        expect(response.body.message).toMatch(/The old password does not match the current one/i)
      })

      it('should successfully update the password to a new one', async () => {
        const response = await request(app).put(PASSWORD_URL)
          .set('Cookie', inspectorCookie)
          .send({
            old_password: 'Qwerty1234',
            new_password: '!Qwerty_1234',
            confirmation_new_password: '!Qwerty_1234'
          })

        expect(response.status).toEqual(200)
        expect(response.body.message).toMatch(/Password updated successfully/i)
      })
    })
  })

  describe('authorized with manager role', () => {
    let managerCookie = ''

    beforeAll(async () => {
      const response = await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'www.bob@mail.com',
          password: '!Qwerty1234'
        })

      managerCookie = response.headers['set-cookie']
    })

    afterAll(async () => {
      await request(app).delete(LOGOUT_URL)
      managerCookie = ''
    })

    describe(`sends request to GET: ${USER_URL}`, () => {
      it('should return manager profile data', async () => {
        const response = await request(app)
          .get(USER_URL)
          .set('Cookie', managerCookie)

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

    // TODO:
    // create when there is functionality
    it.todo(`sends request to PUT: ${USER_URL}`)
    it.todo(`sends request to PUT: ${PASSWORD_URL}`)
  })
})
