import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

export const GetUser = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest()

  if (!req) throw new InternalServerErrorException('User not found')

  return req.user
})
