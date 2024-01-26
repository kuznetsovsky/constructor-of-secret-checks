import request from 'supertest'
import { app } from '../../source/app'

describe('When a client sends request to', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const INSPECTORS_URL = '/api/v1/companies/inspectors'

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

  describe(`POST: ${INSPECTORS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(INSPECTORS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(INSPECTORS_URL)
            .set('Cookie', adminCookie)
            .send({})

          expect(response.statusCode).toBe(422)
        })

        it('should return the status city not found', async () => {
          const response = await request(app)
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
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
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
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
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
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

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
            .send({})

          expect(response.statusCode).toBe(422)
        })

        it('should return the status city not found', async () => {
          const response = await request(app)
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
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
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
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
            .post(INSPECTORS_URL)
            .set('Cookie', managerCookie)
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

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .post(INSPECTORS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${INSPECTORS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(INSPECTORS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should successfully return a list of company inspectors', async () => {
          const response = await request(app)
            .get(INSPECTORS_URL)
            .set('Cookie', adminCookie)

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
            .get(`${INSPECTORS_URL}?city=Karaganda`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should return an empty array', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}?city=Sochi`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.inspectors.length).toBe(0)
          expect(response.body.inspectors).toEqual([])
        })

        it('should return a list of company inspectors whose last names begin with "Fo"', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}?surname=Fo`)
            .set('Cookie', adminCookie)

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

      describe('and with manager role', () => {
        it('should successfully return a list of company inspectors', async () => {
          const response = await request(app)
            .get(INSPECTORS_URL)
            .set('Cookie', managerCookie)

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
            .get(`${INSPECTORS_URL}?city=Karaganda`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should return an empty array', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}?city=Sochi`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.inspectors.length).toBe(0)
          expect(response.body.inspectors).toEqual([])
        })

        it('should return a list of company inspectors whose last names begin with "Fo"', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}?surname=Fo`)
            .set('Cookie', managerCookie)

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

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(INSPECTORS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${INSPECTORS_URL}/{inspector_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${INSPECTORS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/i)
        })

        it('should return inspector profile by id 1', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)

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

      describe('and with manager role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/i)
        })

        it('should return inspector profile by id 1', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)

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

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PUT: ${INSPECTORS_URL}/{inspector_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(`${INSPECTORS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({})

          expect(response.statusCode).toBe(422)
        })

        it('should return the status city not found', async () => {
          const response = await request(app)
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)
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
            .put(`${INSPECTORS_URL}/2`)
            .set('Cookie', adminCookie)
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
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)
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

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({})

          expect(response.statusCode).toBe(422)
        })

        it('should return the status city not found', async () => {
          const response = await request(app)
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)
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
            .put(`${INSPECTORS_URL}/2`)
            .set('Cookie', managerCookie)
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
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)
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

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(`${INSPECTORS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PATCH: ${INSPECTORS_URL}/{inspector_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).patch(`${INSPECTORS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({})

          expect(response.statusCode).toBe(422)
        })

        it('should return the status unmodified', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({ status: 'verification' })

          expect(response.statusCode).toBe(304)
        })

        it('should return status updated successfully', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({ status: 'approved' })

          expect(response.statusCode).toBe(200)
          expect(response.body.message).toMatch(/status updated successfully/i)
        })
      })

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({})

          expect(response.statusCode).toBe(422)
        })

        it('should return the status unmodified', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({ status: 'verification' })

          expect(response.statusCode).toBe(304)
        })

        it('should return status updated successfully', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({ status: 'approved' })

          expect(response.statusCode).toBe(200)
          expect(response.body.message).toMatch(/status updated successfully/i)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .patch(`${INSPECTORS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`DELETE: ${INSPECTORS_URL}/{inspector_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).delete(`${INSPECTORS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .delete(`${INSPECTORS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/i)
        })

        it('should successfully remove the inspector', async () => {
          const response = await request(app)
            .delete(`${INSPECTORS_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with manager role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .delete(`${INSPECTORS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/i)
        })

        it('should successfully remove the inspector', async () => {
          const response = await request(app)
            .delete(`${INSPECTORS_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .delete(`${INSPECTORS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`POST: ${INSPECTORS_URL}/{email}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(`${INSPECTORS_URL}/www.ex@mple.com`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.ex@mple.com`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return cannot be assigned as inspector', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.jane@mail.com`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
        })

        it('should return status 200', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.tim@mail.com`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
        })
      })

      describe('and with manager role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.ex@mple.com`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return cannot be assigned as inspector', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.jane@mail.com`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
        })

        it('should return status 200', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.tim@mail.com`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .post(`${INSPECTORS_URL}/www.ex@mple.com`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${INSPECTORS_URL}/{email}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${INSPECTORS_URL}/www.ex@mple.com`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/www.ex@mple.com`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return status 200', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/www.jane@mail.com`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
        })
      })

      describe('and with manager role', () => {
        it('should return the status "not found"', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/www.ex@mple.com`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return status 200', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/www.jane@mail.com`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${INSPECTORS_URL}/www.ex@mple.com`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
