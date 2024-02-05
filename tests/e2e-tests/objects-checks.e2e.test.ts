import request from 'supertest'
import { app } from '../../source/app'
import { createData } from '../../knex/seeds/14_object_checks'

describe('When a client sends request to', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const OBJECT_URL = '/api/v1/companies/objects'
  const CHECKS_URL = 'checks'

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

  describe(`POST: ${OBJECT_URL}/{object_id}/${CHECKS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(`${OBJECT_URL}/1/${CHECKS_URL}`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/NaN/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(2),
              inspector_id: 4,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
          expect(response.body).toMatchObject({
            type: 'body',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return status 404 if the check type and template do not match', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(2),
              inspector_id: 4,
              check_type_id: 5,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message)
            .toMatch(/Template not found or check type not suitable for template check/)
        })

        it('should return status 400 and message date should be greater', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(0),
              inspector_id: 4,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(400)
          expect(response.body.message).toMatch(/The date must be greater than today/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/2/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(1),
              inspector_id: 4,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Object is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(1),
              inspector_id: 0,
              check_type_id: 1,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Check type is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(1),
              inspector_id: 0,
              check_type_id: 4,
              template_id: 1
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message)
            .toMatch(/Template not found or check type not suitable for template check/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)
            .send({
              date: createData(1),
              inspector_id: 1,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/)
        })
      })

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/NaN/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(2),
              inspector_id: 4,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(422)
          expect(response.body).toMatchObject({
            type: 'body',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return status 404 if the check type and template do not match', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(2),
              inspector_id: 4,
              check_type_id: 5,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message)
            .toMatch(/Template not found or check type not suitable for template check/)
        })

        it('should return status 400 and message date should be greater', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(0),
              inspector_id: 4,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(400)
          expect(response.body.message).toMatch(/The date must be greater than today/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/2/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(1),
              inspector_id: 4,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Object is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(1),
              inspector_id: 0,
              check_type_id: 1,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Check type is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(1),
              inspector_id: 0,
              check_type_id: 4,
              template_id: 1
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message)
            .toMatch(/Template not found or check type not suitable for template check/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)
            .send({
              date: createData(1),
              inspector_id: 1,
              check_type_id: 4,
              template_id: 2
            })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .post(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${OBJECT_URL}/{object_id}/${CHECKS_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${OBJECT_URL}/1/${CHECKS_URL}`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/2/${CHECKS_URL}`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(403)
          expect(response.body.message)
            .toMatch(/The object was not found or you do not have access to this object/)
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/NaN/${CHECKS_URL}`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should successfully return a list of company checks', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.checks).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({
                id: 2,
                status: 'appointed',
                task_name: 'Проверка качества обслуживания',
                type_name: 'Доставка',
                date_of_inspection: expect.any(String),
                inspector_name: 'John Fox',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              }),
              expect.objectContaining({
                id: 1,
                status: 'appointed',
                task_name: 'Проверка качества обслуживания',
                type_name: 'Доставка',
                date_of_inspection: expect.any(String),
                inspector_name: ' ',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              })
            ])
          )
        })
      })

      describe('and with manager role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/2/${CHECKS_URL}`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(403)
          expect(response.body.message)
            .toMatch(/The object was not found or you do not have access to this object/)
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/NaN/${CHECKS_URL}`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should successfully return a list of company checks', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.checks).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({
                id: 2,
                status: 'appointed',
                task_name: 'Проверка качества обслуживания',
                type_name: 'Доставка',
                date_of_inspection: expect.any(String),
                inspector_name: 'John Fox',
                created_at: expect.any(String),
                updated_at: expect.any(String)
              }),
              expect.objectContaining({
                id: 1,
                status: 'appointed',
                task_name: 'Проверка качества обслуживания',
                type_name: 'Доставка',
                date_of_inspection: expect.any(String),
                inspector_name: ' ',
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
            .get(`${OBJECT_URL}/1/${CHECKS_URL}`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${OBJECT_URL}/{object_id}/${CHECKS_URL}/{check_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return not found status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/3`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/NaN/${CHECKS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/NaN`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should successfully return check data', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            link_url: '/company-check?check_code=RbBBrCDUXPCG1S4wxggO1w',
            date_of_inspection: expect.any(String),
            type_name: 'Доставка',
            object: {
              id: 1,
              name: 'Bosco Cafe',
              street: 'Red square',
              house_number: '3A',
              city: 'Moscow'
            },
            inspector: {
              id: 1,
              first_name: 'John',
              last_name: 'Fox',
              vk_link: null,
              email: 'www.jhon@mail.com',
              city: 'Kazan',
              phone_number: '+15555555521'
            }
          })
        })
      })

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/NaN/${CHECKS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/NaN`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/3`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should successfully return check data', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            link_url: '/company-check?check_code=RbBBrCDUXPCG1S4wxggO1w',
            date_of_inspection: expect.any(String),
            type_name: 'Доставка',
            object: {
              id: 1,
              name: 'Bosco Cafe',
              street: 'Red square',
              house_number: '3A',
              city: 'Moscow'
            },
            inspector: {
              id: 1,
              first_name: 'John',
              last_name: 'Fox',
              vk_link: null,
              email: 'www.jhon@mail.com',
              city: 'Kazan',
              phone_number: '+15555555521'
            }
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .get(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PATCH: ${OBJECT_URL}/{object_id}/${CHECKS_URL}/{check_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/NaN/${CHECKS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/NaN`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({
              name: 'Alex',
              age: 132
            })

          expect(response.statusCode).toBe(304)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/3`)
            .set('Cookie', adminCookie)
            .send({ check_type_id: 1 })

          expect(response.statusCode).toBe(404)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({ check_type_id: 1 })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Type is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({ template_id: 1 })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Task is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({ inspector_id: 1 })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/)
        })

        it('should return status bad request', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({
              inspector_id: 4,
              check_type_id: 4,
              template_id: 3
            })

          expect(response.statusCode).toBe(400)
          expect(response.body.message).toMatch(/The check type is not suitable for the check template/)
        })

        it('should successfully update the check data', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)
            .send({
              inspector_id: 4,
              check_type_id: 5,
              template_id: 3
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 1,
            link_url: '/company-check?check_code=FYqfjFrO7B68nEnFo6N9oQ',
            date_of_inspection: expect.any(String),
            type_name: 'Зал',
            object: {
              id: 1,
              name: 'Bosco Cafe',
              street: 'Red square',
              house_number: '3A',
              city: 'Moscow'
            },
            inspector: {
              id: 4,
              first_name: 'Ketty',
              last_name: 'Johnson',
              vk_link: null,
              email: 'www.ketty@mail.com',
              city: 'Novosibirsk',
              phone_number: null
            }
          })
        })
      })

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/NaN/${CHECKS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/NaN`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({
              name: 'Alex',
              age: 132
            })

          expect(response.statusCode).toBe(304)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/3`)
            .set('Cookie', managerCookie)
            .send({ check_type_id: 1 })

          expect(response.statusCode).toBe(404)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({ check_type_id: 1 })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Type is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({ template_id: 1 })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Task is not found/)
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({ inspector_id: 1 })

          expect(response.statusCode).toBe(404)
          expect(response.body.message).toMatch(/Inspector is not found/)
        })

        it('should return status bad request', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({
              inspector_id: 4,
              check_type_id: 5,
              template_id: 2
            })

          expect(response.statusCode).toBe(400)
          expect(response.body.message).toMatch(/The check type is not suitable for the check template/)
        })

        it('should successfully update the check data', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)
            .send({
              inspector_id: 4,
              check_type_id: 5,
              template_id: 3
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 1,
            link_url: '/company-check?check_code=FYqfjFrO7B68nEnFo6N9oQ',
            date_of_inspection: expect.any(String),
            type_name: 'Зал',
            object: {
              id: 1,
              name: 'Bosco Cafe',
              street: 'Red square',
              house_number: '3A',
              city: 'Moscow'
            },
            inspector: {
              id: 4,
              first_name: 'Ketty',
              last_name: 'Johnson',
              vk_link: null,
              email: 'www.ketty@mail.com',
              city: 'Novosibirsk',
              phone_number: null
            }
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`DELETE: ${OBJECT_URL}/{object_id}/${CHECKS_URL}/{check_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).patch(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/NaN/${CHECKS_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/NaN`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/3`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with manager role', () => {
        it('should return validation failed status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/NaN/${CHECKS_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/NaN`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(400)
          expect(response.body).toMatchObject({
            type: 'params',
            message: /Validation failed/,
            errors: expect.any(Array)
          })
        })

        it('should return not found status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/3`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with inspector role', () => {
        it('should return status forbidden', async () => {
          const response = await request(app)
            .delete(`${OBJECT_URL}/1/${CHECKS_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
