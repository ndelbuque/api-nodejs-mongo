const app = require('../../src/app')
const request = require('supertest')
const User = require('../../src/models/user')

jest.mock('../../src/models/user')

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should register a new user', async () => {
    const mockCreate = {
      _id: '600aed3de3a682329c11b27c',
      name: 'test',
      email: 'test@test',
      password: '$2a$10$L1f3DEZ7hV7P5kNPjm1O',
      createdAt: '2021-01-22T15:20:29.586Z',
      __v: 0
    }

    User.findOne.mockResolvedValue(false)
    User.create.mockResolvedValue(mockCreate)

    const fakeBody = {
      name: 'test',
      email: 'test@test',
      password: 'test'
    }

    const result = await request(app)
      .post('/auth/register')
      .send(fakeBody)

    const { password, ...expectedBody } = mockCreate

    expect(User.findOne).toBeCalledTimes(1)
    expect(User.findOne).toBeCalledWith({ email: fakeBody.email })

    expect(User.create).toBeCalledTimes(1)
    expect(User.create).toBeCalledWith(fakeBody)

    expect(result.body).toEqual({ user: expectedBody })
    expect(result.statusCode).toBe(200)
  })

  it('should try to register a user, but returns that it already exists', async () => {
    User.findOne.mockResolvedValue(true)
    User.create.mockResolvedValue()

    const fakeBody = {
      name: 'test',
      email: 'test@test',
      password: 'test'
    }

    const result = await request(app)
      .post('/auth/register')
      .send(fakeBody)

    expect(User.findOne).toBeCalledTimes(1)
    expect(User.findOne).toBeCalledWith({ email: fakeBody.email })

    expect(User.create).toBeCalledTimes(0)

    expect(result.body).toEqual({ error: 'user already exist' })
    expect(result.statusCode).toBe(409)
  })

  it('should try to register a user, but creation fails', async () => {
    User.findOne.mockResolvedValue(false)
    User.create.mockRejectedValue(new Error('error database'))

    const fakeBody = {
      name: 'test',
      email: 'test@test',
      password: 'test'
    }

    const result = await request(app)
      .post('/auth/register')
      .send(fakeBody)

    expect(User.findOne).toBeCalledTimes(1)
    expect(User.findOne).toBeCalledWith({ email: fakeBody.email })

    expect(User.create).toBeCalledTimes(1)
    expect(User.create).toBeCalledWith(fakeBody)

    expect(result.body).toEqual({ error: 'failed register' })
    expect(result.statusCode).toBe(500)
  })
})
