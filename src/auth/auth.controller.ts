import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IncomingHttpHeaders } from 'http'
import { AuthService } from './auth.service'
import { GetUser, RawHeaders } from './decorators'
import { RoleProtected } from './decorators/role-protected.decorator'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities/user.entity'
import { UserRoleGuard } from './guards/user-role/user-role.guard'
import { validRoles } from './interfaces'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto)
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRout(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    console.log(request)
    return { user, userEmail, rawHeaders, headers }
  }

  @Get('private2')
  @RoleProtected(validRoles.superUser, validRoles.adim)
  //@SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return { user }
  }
}
