import { MidMiddleware } from './mid.middleware'

describe('MidMiddleware', () => {
  it('should be defined', () => {
    expect(new MidMiddleware(null)).toBeDefined()
  })
})
