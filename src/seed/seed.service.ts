import { Injectable } from '@nestjs/common'
import { ProductsService } from './../products/products.service'
import { initialData } from './data/seed-data'

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async executeSeed() {
    await this.insertNewsProducts()
    return `executeSeed ok`
  }

  private async insertNewsProducts() {
    this.productsService.deleteAllProducts()

    const products = initialData.products
    const insertPromises = []

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product))
    })

    // await for products.forEach
    await Promise.all(insertPromises)
    return true
  }
}
