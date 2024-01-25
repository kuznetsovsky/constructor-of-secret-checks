import { randomBytes } from 'node:crypto'
import request from 'supertest'

import { app } from '../../source/app'
import { redis } from '../../source/connection'

describe('Email verification endpoints:', () => {
  it.each([
    {
      case: 'email > 128 characters',
      email: 'www.tiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiim@mail.com',
      verificationCode: 'ACTIVATE_CODE',
      statusCode: 422
    },
    {
      case: 'verification_code > 128 characters',
      email: 'www.tim@mail.com',
      verificationCode: 'avxLNKakIjp0sq61In/+iUsleHm2/UnmB7ItmmxI6KBaq/jl/a91yJv5eT3XBRD5VyhR4rbeLrOlQQ8miODkGkbTDh0DbY90cjw6wx45o2qFD6gfrVfasdfasdP78NUq6',
      statusCode: 422
    }
  ])('should return a validation error ($case)', async (payload) => {
    const response = await request(app)
      .put('/api/v1/email-verification')
      .send({
        email: payload.email,
        verification_code: payload.verificationCode
      })

    expect(response.statusCode).toBe(payload.statusCode)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body.message).toMatch(/Validation failed/i)
    expect(response.body.errors[0].message).toMatch(/must NOT have more than 128 characters/i)
  })

  it('should successfully activated account', async () => {
    const code = randomBytes(24).toString('base64')
    await redis.set('email_verification:www.tim@mail.com', code)

    const response = await request(app)
      .put('/api/v1/email-verification')
      .send({
        email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
        verification_code: code
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toMatch(/Account activated successfully/i)
  })

  it('should return incorrect activation code (activation time has expired)', async () => {
    const code = randomBytes(24).toString('base64')
    const key = 'email_verification:www.tim@mail.com'
    await redis.set(key, code)
    await redis.del(key)

    const response = await request(app)
      .put('/api/v1/email-verification')
      .send({
        email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
        verification_code: code
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toMatch(/Invalid activation code or activation time has expired/i)
  })

  it('email activation should be limited after 3 failed attempts', async () => {
    // const code = randomBytes(24).toString('base64')
    // const key = 'email_verification:www.tim@mail.com'
    // await redis.set(key, code)
    // await redis.del(key)
    for (let i = 0; i < 3; i++) {
      const response = await request(app)
        .put('/api/v1/email-verification')
        .send({
          email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
          verification_code: ''
        })

      expect(response.statusCode).toBe(400)
      expect(response.body.message).toMatch(/Invalid activation code or activation time has expired/i)
    }

    const response = await request(app)
      .put('/api/v1/email-verification')
      .send({
        email: 'd3d3LnRpbUBtYWlsLmNvbQ==',
        verification_code: ''
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toMatch(/Account activation attempts exceeded. Please try again in 15 minutes/i)
  })
})
