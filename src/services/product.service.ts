import { EntityRepository, Repository } from 'typeorm';
import { HttpException } from '@/exceptions/HttpException';
import { Product } from '../interfaces/product.interface';
import { CreateProductDto } from '@/dtos/product.dto';
import { ProductEntity } from '@/entities/product.entity';

@EntityRepository()
class ProductService extends Repository<ProductEntity> {
  public async findAllProduct(limit: number, offset: number): Promise<{ product: Product[]; count: number }> {
    const [product, count]: [Product[], number] = await ProductEntity.createQueryBuilder('qb')
      .leftJoinAndSelect('qb.category', 'ct')
      .leftJoinAndSelect('qb.unit', 'unt')
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .orderBy('qb.id', 'ASC')
      .getManyAndCount();

    return { product, count };
  }

  public async searchProduct(limit: number, offset: number, key: string): Promise<{ product: Product[]; count: number }> {
    const [product, count]: [Product[], number] = await ProductEntity.createQueryBuilder('qb')
      .leftJoinAndSelect('qb.category', 'ct')
      .leftJoinAndSelect('qb.unit', 'unt')
      .where('LOWER(qb.designation) LIKE :desi OR LOWER(ct.designation) LIKE :desi OR LOWER(unt.designation) LIKE :desi', {
        desi: `%${key.toLowerCase()}%`,
      })
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .getManyAndCount();

    return { product, count };
  }

  public async getProductById(productId: number): Promise<Product> {
    const product: Product = await ProductEntity.findOne({
      where: { id: productId },
      relations: ['category', 'unit'],
    });

    return product;
  }

  public async updateProduct(productId: number, productData: CreateProductDto): Promise<Product> {
    const findProduct: Product = await ProductEntity.findOne({ where: { id: productId }, relations: ['unit', 'category'] });
    if (!findProduct) throw new HttpException(409, 'contact not found');

    await ProductEntity.update(productId, { ...productData });

    const updateProduct: Product = await ProductEntity.findOne({ where: { id: productId }, relations: ['unit', 'category'] });
    return updateProduct;
  }

  public async deleteProduct(productId: number): Promise<Object> {
    const findProduct: Product = await ProductEntity.findOne({ where: { id: productId } });

    if (!findProduct) throw new HttpException(409, 'productId not found');

    await ProductEntity.delete({ id: productId });
    return { success: true };
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const createProduct: Product = await ProductEntity.create({ ...productData }).save();

    return createProduct;
  }
}

export default ProductService;
