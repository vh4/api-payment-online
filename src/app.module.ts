import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { HelpersModule } from './helpers/helpers.module'
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
} from '@nestjs/core'
import { TimeInterceptor } from './interceptor/time/time.interceptor'
import { SuccessInterceptor } from './interceptor/success/success.interceptor'
import { ErrorFilter } from './filter/error/error.filter'
import { MidMiddleware } from './middleware/mid/mid.middleware'
import { AuthModule } from './auth/auth.module'
import { UserAgentMiddleware } from './middleware/user-agent/user-agent.middleware'
import { InquiryModule } from './inquiry/inquiry.module'
import { PaymentModule } from './payment/payment.module'
import { AuthMiddleware } from './auth/auth.middleware'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GlobalSetting } from './helpers/model/global-setting.model'
import { UtilityModule } from './utility/utility.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [GlobalSetting],
    }),
    HelpersModule,
    AuthModule,
    InquiryModule,
    PaymentModule,
    UtilityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MidMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
    consumer.apply(UserAgentMiddleware).forRoutes(
      {
        path: '/api/auth',
        method: RequestMethod.POST,
      },
      {
        path: '/api/redirect',
        method: RequestMethod.GET,
      }
    )
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/api/inquiry/*',
        method: RequestMethod.POST,
      },
      {
        path: '/api/payment/*',
        method: RequestMethod.POST,
      }
    )
  }
}
