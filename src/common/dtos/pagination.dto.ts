import { IsOptional, IsPositive, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) //enableImplicitConvertsion:true
  limit?: number

  @IsOptional()
  @Min(0)
  @Type(() => Number) //enableImplicitConvertsion:true
  offset?: number
}
