import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { User } from './entities/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

//console.log(process.env.JWT_SECRET)
//console.log(configService.get('JWT_SECRET'))

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { secret: configService.get('JWT_SECRET'), signOptions: { expiresIn: '2h' } }
      },
    }),
    // JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '2h' } }),
  ],
  exports: [TypeOrmModule],
})
export class AuthModule {}
