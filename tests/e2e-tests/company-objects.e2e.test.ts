import request from 'supertest'
import { app } from '../../source/app'

describe('When a client', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const OBJECTS_URL = '/api/v1/companies/objects'

  describe('not authorized sends request to ', () => {
    describe(`POST: ${OBJECTS_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(OBJECTS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`GET: ${OBJECTS_URL}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(OBJECTS_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`GET: ${OBJECTS_URL}/{company_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${OBJECTS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`PUT: ${OBJECTS_URL}/{company_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).put(`${OBJECTS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe(`DELETE: ${OBJECTS_URL}/{company_id}`, () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).delete(`${OBJECTS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })
  })

  describe('authorized sends request to', () => {
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

    describe(`POST: ${OBJECTS_URL}`, () => {
      describe('with administrator role', () => {
        it('should return conflict status', async () => {
          const response = await request(app)
            .post(OBJECTS_URL)
            .set('Cookie', adminCookie)
            .send({
              entry_type: 'public',
              name: 'Bosco Cafe',
              street: 'Central Street',
              house_number: '1A',
              city_id: 1
            })

          expect(response.statusCode).toBe(409)
          expect(response.body.message).toMatch(/This name already exists/i)
        })

        it('should return city not found status', async () => {
          const response = await request(app)
            .post(OBJECTS_URL)
            .set('Cookie', adminCookie)
            .send({
              entry_type: 'public',
              name: 'Soika',
              street: 'Central Street',
              house_number: '1A',
              city_id: 100
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should successfully create the company object', async () => {
          const COMPANY_OBJECT_DATA = {
            entry_type: 'public',
            name: 'Res-o-Run',
            street: 'Central Street',
            house_number: '1A'
          }

          const response = await request(app)
            .post(OBJECTS_URL)
            .set('Cookie', adminCookie)
            .send({
              ...COMPANY_OBJECT_DATA,
              city_id: 1
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...COMPANY_OBJECT_DATA,
            id: 4,
            city: {
              id: 1,
              name: 'Moscow'
            }
          })
        })
      })

      describe('with manager role', () => {
        it('should return conflict status', async () => {
          const response = await request(app)
            .post(OBJECTS_URL)
            .set('Cookie', managerCookie)
            .send({
              entry_type: 'public',
              name: 'Bosco Cafe',
              street: 'Central Street',
              house_number: '1A',
              city_id: 1
            })

          expect(response.statusCode).toBe(409)
          expect(response.body.message).toMatch(/This name already exists/i)
        })

        it('should return city not found status', async () => {
          const response = await request(app)
            .post(OBJECTS_URL)
            .set('Cookie', managerCookie)
            .send({
              entry_type: 'public',
              name: 'Soika',
              street: 'Central Street',
              house_number: '1A',
              city_id: 100
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should successfully create the company object', async () => {
          const COMPANY_OBJECT_DATA = {
            entry_type: 'public',
            name: 'Res-o-Run',
            street: 'Central Street',
            house_number: '1A'
          }

          const response = await request(app)
            .post(OBJECTS_URL)
            .set('Cookie', managerCookie)
            .send({
              ...COMPANY_OBJECT_DATA,
              city_id: 1
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...COMPANY_OBJECT_DATA,
            id: 4,
            city: {
              id: 1,
              name: 'Moscow'
            }
          })
        })
      })

      describe('with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(OBJECTS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })

    describe(`GET: ${OBJECTS_URL}`, () => {
      describe('with administrator role', () => {
        it('should return a list of company objects', async () => {
          const response = await request(app)
            .get(OBJECTS_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.objects.length).toBe(2)
          expect(response.body.objects).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                entry_type: 'public',
                name: 'Bosco Cafe',
                street: 'Red square',
                house_number: '3A',
                city: {
                  id: 1,
                  name: 'Moscow'
                }
              }),
              expect.objectContaining({
                id: 3,
                entry_type: 'manual',
                name: 'Bosco Bar',
                street: 'Okhotny Ryad',
                house_number: '23',
                city: {
                  id: 1,
                  name: 'Moscow'
                }
              })
            ])
          )
        })
      })

      describe('with manager role', () => {
        it('should return a list of company objects', async () => {
          const response = await request(app)
            .get(OBJECTS_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.objects.length).toBe(2)
          expect(response.body.objects).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                entry_type: 'public',
                name: 'Bosco Cafe',
                street: 'Red square',
                house_number: '3A',
                city: {
                  id: 1,
                  name: 'Moscow'
                }
              }),
              expect.objectContaining({
                id: 3,
                entry_type: 'manual',
                name: 'Bosco Bar',
                street: 'Okhotny Ryad',
                house_number: '23',
                city: {
                  id: 1,
                  name: 'Moscow'
                }
              })
            ])
          )
        })
      })

      describe('with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(OBJECTS_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })

    describe(`GET: ${OBJECTS_URL}/{object_id}`, () => {
      describe('with administrator role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .get(`${OBJECTS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return company object data', async () => {
          const response = await request(app)
            .get(`${OBJECTS_URL}/3`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 3,
            entry_type: 'manual',
            name: 'Bosco Bar',
            street: 'Okhotny Ryad',
            house_number: '23',
            city: {
              id: 1,
              name: 'Moscow'
            }
          })
        })
      })

      describe('with manager role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .get(`${OBJECTS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return company object data', async () => {
          const response = await request(app)
            .get(`${OBJECTS_URL}/3`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 3,
            entry_type: 'manual',
            name: 'Bosco Bar',
            street: 'Okhotny Ryad',
            house_number: '23',
            city: {
              id: 1,
              name: 'Moscow'
            }
          })
        })
      })

      describe('with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${OBJECTS_URL}/3`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })

    describe(`PUT: ${OBJECTS_URL}/{object_id}`, () => {
      describe('when administrator role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/2`)
            .set('Cookie', adminCookie)
            .send({
              entry_type: 'public',
              name: 'The Name',
              street: 'Central Street',
              house_number: '1A',
              city_id: 1
            })

          expect(response.statusCode).toBe(404)
        })

        it('should return conflict status', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', adminCookie)
            .send({
              entry_type: 'public',
              name: 'Bosco Cafe',
              street: 'Central Street',
              house_number: '1A',
              city_id: 1
            })

          expect(response.statusCode).toBe(409)
          expect(response.body.message).toMatch(/This name already exists/i)
        })

        it('should return city not found status', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', adminCookie)
            .send({
              entry_type: 'public',
              name: 'Soika',
              street: 'Central Street',
              house_number: '1A',
              city_id: 100
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should successfully update the company object data', async () => {
          const COMPANY_OBJECT_DATA = {
            entry_type: 'public',
            name: 'Res-o-Run',
            street: 'Central Street',
            house_number: '1A'
          }

          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', adminCookie)
            .send({
              ...COMPANY_OBJECT_DATA,
              city_id: 6
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...COMPANY_OBJECT_DATA,
            id: 3,
            city: {
              id: 6,
              name: 'Kazan'
            }
          })
        })
      })

      describe('when manager role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/2`)
            .set('Cookie', managerCookie)
            .send({
              entry_type: 'public',
              name: 'The Name',
              street: 'Central Street',
              house_number: '1A',
              city_id: 1
            })

          expect(response.statusCode).toBe(404)
        })

        it('should return conflict status', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', managerCookie)
            .send({
              entry_type: 'public',
              name: 'Bosco Cafe',
              street: 'Central Street',
              house_number: '1A',
              city_id: 1
            })

          expect(response.statusCode).toBe(409)
          expect(response.body.message).toMatch(/This name already exists/i)
        })

        it('should return city not found status', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', managerCookie)
            .send({
              entry_type: 'public',
              name: 'Soika',
              street: 'Central Street',
              house_number: '1A',
              city_id: 100
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/City is not found/i)
        })

        it('should successfully update the company object data', async () => {
          const COMPANY_OBJECT_DATA = {
            entry_type: 'public',
            name: 'Res-o-Run',
            street: 'Central Street',
            house_number: '1A'
          }

          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', managerCookie)
            .send({
              ...COMPANY_OBJECT_DATA,
              city_id: 6
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            ...COMPANY_OBJECT_DATA,
            id: 3,
            city: {
              id: 6,
              name: 'Kazan'
            }
          })
        })
      })

      describe('with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .put(`${OBJECTS_URL}/3`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })

    describe(`DELETE: ${OBJECTS_URL}/{object_id}`, () => {
      describe('with administrator role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .delete(`${OBJECTS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          {
            const response = await request(app)
              .delete(`${OBJECTS_URL}/3`)
              .set('Cookie', adminCookie)

            expect(response.statusCode).toBe(204)
          }

          {
            const response = await request(app)
              .delete(`${OBJECTS_URL}/3`)
              .set('Cookie', adminCookie)

            expect(response.statusCode).toBe(404)
          }
        })
      })

      describe('with manager role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .delete(`${OBJECTS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          {
            const response = await request(app)
              .delete(`${OBJECTS_URL}/3`)
              .set('Cookie', managerCookie)

            expect(response.statusCode).toBe(204)
          }

          {
            const response = await request(app)
              .delete(`${OBJECTS_URL}/3`)
              .set('Cookie', managerCookie)

            expect(response.statusCode).toBe(404)
          }
        })
      })

      describe('with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .delete(`${OBJECTS_URL}/2`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
