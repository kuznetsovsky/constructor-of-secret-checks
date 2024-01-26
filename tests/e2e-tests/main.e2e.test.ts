import request from 'supertest'
import { app } from '../../source/app'

describe('When a client sends a request to', () => {
  describe('GET: /', () => {
    it('should return status code 200 and a message to go to the API', async () => {
      const response = await request(app).get('/')

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({
        message: expect.stringMatching(/API is working, change to version/)
      })
    })
  })

  describe('GET: /not-found-page', () => {
    it('should return a 404 status code and an empty response body', async () => {
      const response = await request(app).get('/not-found-page')
      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual({})
    })
  })
})
