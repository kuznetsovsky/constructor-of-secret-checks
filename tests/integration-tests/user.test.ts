import request from 'supertest'
import { app } from '../../source/app'

describe('User endpoints:', () => {
  const SIGN_IN_URL = '/api/v1/auth/sign-in'
  const USER_URL = '/api/v1/user'

  describe('GET: /user', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get(USER_URL)

      expect(response.statusCode).toBe(401)
    })

    it('should return inspector profile data', async () => {
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.jhon@mail.com',
          password: 'Qwerty1234'
        })

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      // GET USER PROFILE
      // =-=-=-=-=-=-=-=-=-=

      const profileResponse = await request(app)
        .get(USER_URL)
        .set('Cookie', cookies)

      expect(profileResponse.statusCode).toBe(200)
      expect(profileResponse.body).toMatchObject({
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
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      // GET USER PROFILE
      // =-=-=-=-=-=-=-=-=-=

      const profileResponse = await request(app)
        .get(USER_URL)
        .set('Cookie', cookies)

      expect(profileResponse.statusCode).toBe(200)
      expect(profileResponse.body).toMatchObject({
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
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const authResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.bob@mail.com',
          password: '!Qwerty1234'
        })

      expect(authResponse.status).toEqual(200)
      const cookies = authResponse.headers['set-cookie']

      // GET USER PROFILE
      // =-=-=-=-=-=-=-=-=-=

      const profileResponse = await request(app)
        .get(USER_URL)
        .set('Cookie', cookies)

      expect(profileResponse.statusCode).toBe(200)
      expect(profileResponse.body).toMatchObject({
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

  describe('PUT: /user', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get(USER_URL)

      expect(response.statusCode).toBe(401)
    })

    describe('update inspector profile:', () => {
      const INSPECTOR_DATA = {
        first_name: 'John',
        last_name: 'Morello',
        birthday: '2012-10-11',
        vk_link: 'https://vk.com/jmorello',
        address: 'Центральная, 9A',
        city_id: 1,
        phone_number: '+1999555123'
      }

      it.each([
        {
          ...INSPECTOR_DATA,
          case: 'first_name less than 3 characters',
          first_name: 'J',
          validate: {
            instancePath: '/first_name',
            message: 'must NOT have fewer than 3 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'first_name more than 16 characters',
          first_name: 'Joooooooooooooohn',
          validate: {
            instancePath: '/first_name',
            message: 'must NOT have more than 16 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'last_name less than 3 characters',
          last_name: 'F',
          validate: {
            instancePath: '/last_name',
            message: 'must NOT have fewer than 3 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'last_name more than 24 characters',
          last_name: 'Fooooooooooooooooooooooox',
          validate: {
            instancePath: '/last_name',
            message: 'must NOT have more than 24 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'birthday should be < 2024-01-01',
          birthday: '2024-01-02',
          validate: {
            instancePath: '/birthday',
            message: 'should be < 2024-01-01'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'birthday should be >= 2000-01-01',
          birthday: '1999-12-01',
          validate: {
            instancePath: '/birthday',
            message: 'should be >= 2000-01-01'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'birthday must match format "date"',
          birthday: '2022-22-01',
          validate: {
            instancePath: '/birthday',
            message: 'must match format "date"'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'vk_link more than 48 characters',
          vk_link: 'https://vk.com/jmorellllllllllllllllllllllllllllo',
          validate: {
            instancePath: '/vk_link',
            message: 'must NOT have more than 48 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'address more than 64 characters',
          address: 'Центральная, 9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          validate: {
            instancePath: '/address',
            message: 'must NOT have more than 64 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'phone_number more than 16 characters',
          phone_number: '+1555444333222109',
          validate: {
            instancePath: '/phone_number',
            message: 'must NOT have more than 16 characters'
          }
        },
        {
          ...INSPECTOR_DATA,
          case: 'city_id must be >= 1',
          city_id: 0,
          validate: {
            instancePath: '/city_id',
            message: 'must be >= 1'
          }
        }
      ])('should return a validation error ($case)', async (payload) => {
        // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

        const authResponse = await request(app)
          .post(SIGN_IN_URL)
          .send({
            email: 'www.jhon@mail.com',
            password: 'Qwerty1234'
          })

        expect(authResponse.status).toEqual(200)
        const cookies = authResponse.headers['set-cookie']

        // VALIDATION USER PROFILE PAYLOAD
        // =-=-=-=-=-=-=-=-=-=

        const response = await request(app)
          .put(USER_URL)
          .set('Cookie', cookies)
          .send(payload)

        expect(response.status).toEqual(422)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body.message).toMatch(/Validation failed/i)
        expect(response.body.errors[0].instancePath).toMatch(payload.validate.instancePath)
        expect(response.body.errors[0].message).toMatch(payload.validate.message)
      })

      it('should successfully update inspector profile', async () => {
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

        const authResponse = await request(app)
          .post(SIGN_IN_URL)
          .send({
            email: 'www.jhon@mail.com',
            password: 'Qwerty1234'
          })

        expect(authResponse.status).toEqual(200)
        const cookies = authResponse.headers['set-cookie']

        // GET USER PROFILE
        // =-=-=-=-=-=-=-=-=-=

        const INSPECTOR_PROFILE_PAYLOAD = {
          first_name: 'John',
          last_name: 'Morello',
          birthday: '2012-10-11',
          vk_link: 'https://vk.com/jmorello',
          address: 'Центральная, 9A',
          phone_number: '+1999555123'
        }

        const profileResponse = await request(app)
          .put(USER_URL)
          .set('Cookie', cookies)
          .send({
            city_id: 1,
            ...INSPECTOR_PROFILE_PAYLOAD
          })

        expect(profileResponse.statusCode).toBe(200)
        expect(profileResponse.body).toMatchObject({
          id: 1,
          role: 'inspector',
          email: 'www.jhon@mail.com',
          city: {
            id: 1,
            name: 'Moscow'
          },
          ...INSPECTOR_PROFILE_PAYLOAD,
          birthday: '2012-10-10T20:00:00.000Z'
        })
      })
    })

    describe('update administrator profile:', () => {
      const ADMIN_PROFILE_PAYLOAD = {
        first_name: 'Marry',
        last_name: 'Doe',
        phone_number: '+15555551234'
      }

      it.each([
        {
          ...ADMIN_PROFILE_PAYLOAD,
          case: 'first_name less than 3 characters',
          first_name: 'M',
          validate: {
            instancePath: '/first_name',
            message: 'must NOT have fewer than 3 characters'
          }
        },
        {
          ...ADMIN_PROFILE_PAYLOAD,
          case: 'first_name more than 16 characters',
          first_name: 'Maaaaaaaaaaaaaary',
          validate: {
            instancePath: '/first_name',
            message: 'must NOT have more than 16 characters'
          }
        },
        {
          ...ADMIN_PROFILE_PAYLOAD,
          case: 'last_name less than 3 characters',
          last_name: 'D',
          validate: {
            instancePath: '/last_name',
            message: 'must NOT have fewer than 3 characters'
          }
        },
        {
          ...ADMIN_PROFILE_PAYLOAD,
          case: 'last_name more than 24 characters',
          last_name: 'Doooooooooooooooooooooooe',
          validate: {
            instancePath: '/last_name',
            message: 'must NOT have more than 24 characters'
          }
        },
        {
          ...ADMIN_PROFILE_PAYLOAD,
          case: 'phone_number more than 16 characters',
          phone_number: '+1555444333222109',
          validate: {
            instancePath: '/phone_number',
            message: 'must NOT have more than 16 characters'
          }
        }
      ])('should return a validation error ($case)', async (payload) => {
        // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

        const authResponse = await request(app)
          .post(SIGN_IN_URL)
          .send({
            email: 'www.jane@mail.com',
            password: 'Qwerty_1234'
          })

        expect(authResponse.status).toEqual(200)
        const cookies = authResponse.headers['set-cookie']

        // VALIDATION USER PROFILE PAYLOAD
        // =-=-=-=-=-=-=-=-=-=

        const response = await request(app)
          .put(USER_URL)
          .set('Cookie', cookies)
          .send(payload)

        expect(response.status).toEqual(422)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body.message).toMatch(/Validation failed/i)
        expect(response.body.errors[0].instancePath).toMatch(payload.validate.instancePath)
        expect(response.body.errors[0].message).toMatch(payload.validate.message)
      })

      it('should successfully update administrator profile', async () => {
        // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

        const authResponse = await request(app)
          .post(SIGN_IN_URL)
          .send({
            email: 'www.jane@mail.com',
            password: 'Qwerty_1234'
          })

        expect(authResponse.status).toEqual(200)
        const cookies = authResponse.headers['set-cookie']

        // GET USER PROFILE
        // =-=-=-=-=-=-=-=-=-=

        const profileResponse = await request(app)
          .put(USER_URL)
          .set('Cookie', cookies)
          .send(ADMIN_PROFILE_PAYLOAD)

        expect(profileResponse.statusCode).toBe(200)
        expect(profileResponse.body).toMatchObject({
          id: 2,
          role: 'administrator',
          email: 'www.jane@mail.com',
          company: {
            id: 1,
            name: 'Модный кабачок'
          },
          ...ADMIN_PROFILE_PAYLOAD
        })
      })
    })
  })

  describe('PUT: /user/change-password', () => {
    it.each([
      {
        case: 'must NOT have fewer than 8 characters',
        old_password: '!Qwerty',
        new_password: '!Qwerty',
        confirmation_new_password: '!Qwerty'
      },
      {
        case: 'must NOT have more than 255 characters',
        old_password: '5bc33b60bfcd1bec5e085d4a29c17eda345c26d98ba30dde8652fb135dd92e0862dc5b99849870ec2695c265c26d98ba30d5bc33b60bfcd1bec5e085d4a29c17eda348be4ea3f7abde8652fb135dd92e0862dc5b99849870ec268652fb135dd92e0862dc5b99849asd878661fnbfa52fb135dd92e0862dc5bgdsfgdfg9984987',
        new_password: '5bc33b60bfcd1bec5e085d4a29c17eda345c26d98ba30dde8652fb135dd92e0862dc5b99849870ec2695c265c26d98ba30d5bc33b60bfcd1bec5e085d4a29c17eda348be4ea3f7abde8652fb135dd92e0862dc5b99849870ec268652fb135dd92e0862dc5b99849asd878661fnbfa52fb135dd92e0862dc5bgdsfgdfg9984987',
        confirmation_new_password: '5bc33b60bfcd1bec5e085d4a29c17eda345c26d98ba30dde8652fb135dd92e0862dc5b99849870ec2695c265c26d98ba30d5bc33b60bfcd1bec5e085d4a29c17eda348be4ea3f7abde8652fb135dd92e0862dc5b99849870ec268652fb135dd92e0862dc5b99849asd878661fnbfa52fb135dd92e0862dc5bgdsfgdfg9984987'
      }
    ])('should return a validation error ($case)', async (payload) => {
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const loginResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      expect(loginResponse.status).toEqual(200)
      const cookies = loginResponse.headers['set-cookie']

      // VALIDATION CHANGE PASSWORD PAYLOAD
      // =-=-=-=-=-=-=-=-=-=

      const response = await request(app)
        .put('/api/v1/user/change-password')
        .set('Cookie', cookies)
        .send(payload)

      expect(response.status).toEqual(422)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/Validation failed/i)
      expect(response.body.errors[0].message).toEqual(payload.case)
      expect(response.body.errors[1].message).toEqual(payload.case)
      expect(response.body.errors[2].message).toEqual(payload.case)
    })

    it('should return the message passwords do not match', async () => {
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const loginResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      expect(loginResponse.status).toEqual(200)
      const cookies = loginResponse.headers['set-cookie']

      // VALIDATION CHANGE PASSWORD PAYLOAD
      // =-=-=-=-=-=-=-=-=-=

      const response = await request(app)
        .put('/api/v1/user/change-password')
        .set('Cookie', cookies)
        .send({
          old_password: '!Qwerty123',
          new_password: '!Qwerty123',
          confirmation_new_password: '!Qwerty132'
        })

      expect(response.status).toEqual(400)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/The new password and the confirmation password do not match/i)
    })

    it('should return the message old password does not match the current one', async () => {
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const loginResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      expect(loginResponse.status).toEqual(200)
      const cookies = loginResponse.headers['set-cookie']

      // CHANGE PASSWORD PAYLOAD
      // =-=-=-=-=-=-=-=-=-=

      const response = await request(app)
        .put('/api/v1/user/change-password')
        .set('Cookie', cookies)
        .send({
          old_password: 'Qwerty1234',
          new_password: '!Qwerty123',
          confirmation_new_password: '!Qwerty123'
        })

      expect(response.status).toEqual(400)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/The old password does not match the current one/i)
    })

    it('should successfully update the password to a new one', async () => {
      // LOGIN USER
      // =-=-=-=-=-=-=-=-=-=

      const loginResponse = await request(app)
        .post(SIGN_IN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
        })

      expect(loginResponse.status).toEqual(200)
      const cookies = loginResponse.headers['set-cookie']

      // CHANGE PASSWORD PAYLOAD
      // =-=-=-=-=-=-=-=-=-=

      const response = await request(app)
        .put('/api/v1/user/change-password')
        .set('Cookie', cookies)
        .send({
          old_password: 'Qwerty_1234',
          new_password: '!Qwerty_1234',
          confirmation_new_password: '!Qwerty_1234'
        })

      expect(response.status).toEqual(200)
      expect(response.headers['content-type']).toMatch(/json/)
      expect(response.body.message).toMatch(/Password updated successfully/i)
    })
  })
})
