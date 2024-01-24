import request from 'supertest'
import { app } from '../../../source/app'

describe('Company templates endpoints:', () => {
  let adminCookie = ''

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/v1/auth/sign-in')
      .send({
        email: 'www.jane@mail.com',
        password: 'Qwerty_1234'
      })

    adminCookie = response.headers['set-cookie']
  })

  afterAll(async () => {
    await request(app).delete('/api/v1/sign-out')
    adminCookie = ''
  })

  describe('POST: /companies/templates', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/companies/templates')

      expect(response.statusCode).toBe(401)
    })

    it('should return validation filed', async () => {
      const response = await request(app)
        .post('/api/v1/companies/templates')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(422)
    })

    it('should return check type id is not found', async () => {
      const response = await request(app)
        .post('/api/v1/companies/templates')
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
        .post('/api/v1/companies/templates')
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

  describe('GET: /companies/templates', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates')

      expect(response.statusCode).toBe(401)
    })

    it('should successfully return a list of templates', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates')
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

  describe('GET: /companies/templates/{template_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return template id is not found', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates/2')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(404)
    })

    it('should successfully return template information', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates/1')
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

  describe('PATCH: /companies/templates/{template_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/templates/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return check type id is not found', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/templates/2')
        .set('Cookie', adminCookie)
        .send({
          check_type_id: 100,
          task_name: 'Проверка внешнего вида сотрудников'
        })

      expect(response.statusCode).toBe(404)
    })

    it('should return validation failed status', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/templates/1')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(422)
    })

    it('should successfully update the template', async () => {
      const response = await request(app)
        .patch('/api/v1/companies/templates/1')
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

  describe('DELETE: /companies/templates/{template_id}', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/templates/1')

      expect(response.statusCode).toBe(401)
    })

    it('should return template id not found status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/templates/2')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(404)
    })

    it('should return no content status', async () => {
      const response = await request(app)
        .delete('/api/v1/companies/templates/1')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(204)
    })
  })

  describe('GET: /companies/templates/{template_id}/preview', () => {
    it('should return the status not authorized', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates/1/preview')

      expect(response.statusCode).toBe(401)
    })

    it('should return template id is not found', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates/2/preview')
        .set('Cookie', adminCookie)

      expect(response.statusCode).toBe(404)
    })

    it('should successfully return template preview information', async () => {
      const response = await request(app)
        .get('/api/v1/companies/templates/1/preview')
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
})
