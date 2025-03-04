import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import type { NestExpressApplication } from '@nestjs/platform-express'
import * as session from 'express-session'
import { DataSource } from 'typeorm'
import { checkDatabaseConnection } from './database/check.database'

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule
    )
  const dataSource = app.get(DataSource)

  await checkDatabaseConnection(dataSource)

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure:
          process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60,
      },
    })
  )

  const port = process.env.PORT || 5000

  await app.listen(port)
}

bootstrap()
