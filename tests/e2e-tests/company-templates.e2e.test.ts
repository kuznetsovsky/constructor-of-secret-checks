import request from 'supertest'
import { app } from '../../source/app'

describe('When a client sends request to', () => {
  const LOGIN_URL = '/api/v1/auth/sign-in'
  const LOGOUT_URL = '/api/v1/sign-out'
  const TEMPLATES_URL = '/api/v1/companies/templates'

  let adminCookie = ''
  let inspectorCookie = ''
  let managerCookie = ''

  beforeAll(async () => {
    {
      const response = await request(app).post(LOGIN_URL)
        .send({
          email: 'www.jane@mail.com',
          password: 'Qwerty_1234'
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

  describe(`POST: ${TEMPLATES_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).post(TEMPLATES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return validation filed', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return check type id is not found', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', adminCookie)
            .send({
              check_type_id: 4,
              task_name: 'Проверка качества обслуживание',
              tasks: [],
              instruction: 'Инструкция для проведения проверки'
            })

          expect(response.statusCode).toBe(404)
        })

        it('should successfully create the template', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', adminCookie)
            .send({
              check_type_id: 1,
              task_name: 'Проверка качества обслуживание',
              tasks: [],
              instruction: 'Инструкция для проведения проверки'
            })

          expect(response.headers.location).toMatch(/\/api\/v1\/companies\/templates\/[0-9]/i)
          expect(response.statusCode).toBe(201)
          expect(response.body).toEqual({
            id: expect.any(Number),
            check_type_id: 1,
            task_name: 'Проверка качества обслуживание',
            instruction: 'Инструкция для проведения проверки',
            tasks: {},
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with manager role', () => {
        it('should return validation filed', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should return check type id is not found', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', managerCookie)
            .send({
              check_type_id: 2,
              task_name: 'Проверка качества обслуживание',
              tasks: [],
              instruction: 'Инструкция для проведения проверки'
            })

          expect(response.statusCode).toBe(404)
        })

        it('should successfully create the template', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', managerCookie)
            .send({
              check_type_id: 4,
              task_name: 'Проверка качества обслуживание',
              tasks: [],
              instruction: 'Инструкция для проведения проверки'
            })

          expect(response.headers.location).toMatch('/api/v1/companies/templates')
          expect(response.statusCode).toBe(201)
          expect(response.body).toEqual({
            id: expect.any(Number),
            check_type_id: 4,
            task_name: 'Проверка качества обслуживание',
            instruction: 'Инструкция для проведения проверки',
            tasks: {},
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return no access status', async () => {
          const response = await request(app)
            .post(TEMPLATES_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${TEMPLATES_URL}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(TEMPLATES_URL)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should successfully return a list of templates', async () => {
          const response = await request(app)
            .get(TEMPLATES_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.templates.length).toBe(1)
          expect(response.body.templates).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                check_type: 'Зал',
                task_name: 'Проверка качества обслуживания'
              })
            ])
          )
        })
      })

      describe('and with manager role', () => {
        it('should successfully return a list of templates', async () => {
          const response = await request(app)
            .get(TEMPLATES_URL)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body.templates.length).toBe(1)
          expect(response.body.templates).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                check_type: 'Зал',
                task_name: 'Проверка качества обслуживания'
              })
            ])
          )
        })
      })

      describe('and with inspector role', () => {
        it('should return no access status', async () => {
          const response = await request(app)
            .get(TEMPLATES_URL)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${TEMPLATES_URL}/{template_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${TEMPLATES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return the status not authorized', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1`)

          expect(response.statusCode).toBe(401)
        })

        it('should return template id is not found', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should successfully return template information', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 1,
            task_name: 'Проверка качества обслуживания',
            instruction: 'Инструкция к выполнению задания',
            tasks: {}
          })
        })
      })

      describe('and with manager role', () => {
        it('should return the status not authorized', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1`)

          expect(response.statusCode).toBe(401)
        })

        it('should return template id is not found', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should successfully return template information', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            task_name: 'Проверка качества обслуживания',
            instruction: 'Инструкция к выполнению задания',
            tasks: {}
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return no access status', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`PATCH: ${TEMPLATES_URL}/{template_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).patch(`${TEMPLATES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return template id not found status', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/4`)
            .set('Cookie', adminCookie)
            .send({
              check_type_id: 1,
              task_name: 'Проверка внешнего вида сотрудников'
            })

          expect(response.statusCode).toBe(404)
        })

        it('should return check type id is not found', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/2`)
            .set('Cookie', adminCookie)
            .send({
              check_type_id: 100,
              task_name: 'Проверка внешнего вида сотрудников'
            })

          expect(response.statusCode).toBe(404)
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should successfully update the template', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/1`)
            .set('Cookie', adminCookie)
            .send({
              check_type_id: 2,
              task_name: 'Проверка внешнего вида сотрудников'
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: expect.any(Number),
            check_type_id: 2,
            task_name: 'Проверка внешнего вида сотрудников',
            instruction: 'Инструкция к выполнению задания',
            tasks: {},
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with manager role', () => {
        it('should return template id not found status', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/1`)
            .set('Cookie', adminCookie)
            .send({
              check_type_id: 4,
              task_name: 'Проверка внешнего вида сотрудников'
            })

          expect(response.statusCode).toBe(404)
        })

        it('should return check type id is not found', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/2`)
            .set('Cookie', managerCookie)
            .send({
              check_type_id: 100,
              task_name: 'Проверка внешнего вида сотрудников'
            })

          expect(response.statusCode).toBe(404)
        })

        it('should return validation failed status', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(422)
        })

        it('should successfully update the template', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/2`)
            .set('Cookie', managerCookie)
            .send({
              check_type_id: 4,
              task_name: 'Проверка внешнего вида сотрудников'
            })

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            check_type_id: 4,
            task_name: 'Проверка внешнего вида сотрудников',
            instruction: 'Инструкция к выполнению задания',
            tasks: {},
            created_at: expect.any(String),
            updated_at: expect.any(String)
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return no access status', async () => {
          const response = await request(app)
            .patch(`${TEMPLATES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`DELETE: ${TEMPLATES_URL}/{template_id}`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).delete(`${TEMPLATES_URL}/1`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return template id not found status', async () => {
          const response = await request(app)
            .delete(`${TEMPLATES_URL}/2`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${TEMPLATES_URL}/1`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with manager role', () => {
        it('should return template id not found status', async () => {
          const response = await request(app)
            .delete(`${TEMPLATES_URL}/1`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should return no content status', async () => {
          const response = await request(app)
            .delete(`${TEMPLATES_URL}/2`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(204)
        })
      })

      describe('and with inspector role', () => {
        it('should return no access status', async () => {
          const response = await request(app)
            .delete(`${TEMPLATES_URL}/1`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })

  describe(`GET: ${TEMPLATES_URL}/{template_id}/preview`, () => {
    describe('without authorization', () => {
      it('should return the status not authorized', async () => {
        const response = await request(app).get(`${TEMPLATES_URL}/1/preview`)
        expect(response.statusCode).toBe(401)
      })
    })

    describe('with authorization', () => {
      describe('and with administrator role', () => {
        it('should return template id is not found', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/2/preview`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should successfully return template preview information', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1/preview`)
            .set('Cookie', adminCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 1,
            logo_url: expect.any(String),
            task_name: 'Проверка качества обслуживания',
            instruction: 'Инструкция к выполнению задания',
            tasks: {}
          })
        })
      })

      describe('and with manager role', () => {
        it('should return template id is not found', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1/preview`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(404)
        })

        it('should successfully return template preview information', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/2/preview`)
            .set('Cookie', managerCookie)

          expect(response.statusCode).toBe(200)
          expect(response.body).toEqual({
            id: 2,
            logo_url: null,
            task_name: 'Проверка качества обслуживания',
            instruction: 'Инструкция к выполнению задания',
            tasks: {}
          })
        })
      })

      describe('and with inspector role', () => {
        it('should return no access status', async () => {
          const response = await request(app)
            .get(`${TEMPLATES_URL}/1/preview`)
            .set('Cookie', inspectorCookie)

          expect(response.statusCode).toBe(403)
        })
      })
    })
  })
})
