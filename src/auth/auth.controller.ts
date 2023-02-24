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
import { Auth, GetUser, RawHeaders } from './decorators'
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

  //@SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(validRoles.superUser, validRoles.adim)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return { user }
  }

  @Get('private3')
  @Auth(validRoles.adim, validRoles.superUser)
  privateRoute3(@GetUser() user: User) {
    return { user }
  }
}
