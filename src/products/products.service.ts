import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { DataSource, Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductImage } from './entities'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImageRepository.create({ url: image })),
      })
      await this.productRepository.save(product)

      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    })

    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }))
  }

  async findOne(value: string) {
    let product: Product

    if (isUUID(value)) {
      product = await this.productRepository.findOneBy({ id: value })
    } else {
      const query = this.productRepository.createQueryBuilder('prod')
      product = await query
        .where('UPPER(title)=:title or slug=:slug', {
          title: value.toUpperCase(),
          slug: value.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()
    }

    if (!product) throw new NotFoundException(`product ${value} not found`)

    return product
  }

  findOnePlain = async (value: string) => {
    const { images = [], ...rest } = await this.findOne(value)
    return { ...rest, images: images.map((image) => image.url) }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto
    const product = await this.productRepository.preload({ id, ...toUpdate })
    if (!product) throw new NotFoundException(`product ${id} not found`)

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner()

    try {
      await this.productRepository.save(product)
      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    return await this.productRepository.remove(product)
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error: check server logs')
  }
}
