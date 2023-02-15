import { Injectable } from '@nestjs/common'
import { ProductsService } from './../products/products.service'

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async executeSeed() {
    await this.insertNewsProducts()
    return `executeSeed ok`
  }

  private async insertNewsProducts() {
    this.productsService.deleteAllProducts()

    return true
  }
}
