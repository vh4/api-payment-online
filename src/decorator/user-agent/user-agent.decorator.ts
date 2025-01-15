import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    const userAgent = req.useragent
    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress

    return {
      ip,
      browser: {
        name: userAgent.browser,
        version: userAgent.version,
        platform: userAgent.platform,
        os: userAgent.os,
        source: userAgent.source,
        isMobile: userAgent.isMobile,
        isDesktop: userAgent.isDesktop,
        isBot: userAgent.isBot,
      },
    }
  }
)
