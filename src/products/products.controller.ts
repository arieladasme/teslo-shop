import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { Auth } from 'src/auth/decorators'
import { validRoles } from 'src/auth/interfaces'

@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(validRoles.user)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto)
  }

  @Get(':value')
  findOne(@Param('value') value: string) {
    return this.productsService.findOnePlain(value)
  }

  @Patch(':id')
  @Auth(validRoles.adim)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto)
  }

  @Delete(':id')
  @Auth(validRoles.adim)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
