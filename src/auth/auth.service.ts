import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      })

      await this.userRepository.save(user)
      delete user.password

      return user // TODO: return jwt access
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    })

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid')

    return user // TODO: return jwt
  }
  //:never -> metodo que nunca retornara algo
  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }
}