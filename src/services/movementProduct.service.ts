import { EntityRepository, QueryBuilder, Repository, getConnection } from 'typeorm';
import { HttpException } from '@/exceptions/HttpException';
import { MovementProduct } from '@/interfaces/movementProduct.interface';
import { MovementProductEntity } from '@/entities/movementProduct.entity';
import { CreateMovementProductDto } from '@/dtos/movementProduct.dto';
import { ProductEntity } from '@/entities/product.entity';
import { DetailMovementProductEntity } from '@/entities/detailMovementProduct.entity';

@EntityRepository()
class MovementProductService extends Repository<MovementProductEntity> {
  public async findAllMovementProduct(
    limit: number,
    offset: number,
    startDate: string,
    endDate: string,
  ): Promise<{ movementProduct: MovementProduct[]; count: number }> {
    if (startDate === '' && endDate === '') {
      const [movementProduct, count]: [MovementProduct[], number] = await MovementProductEntity.createQueryBuilder('qb')
        .limit(limit ? limit : 0)
        .offset(offset ? offset : 0)
        .orderBy('qb.id', 'ASC')
        .getManyAndCount();

      return { movementProduct, count };
    } else {
      const [movementProduct, count]: [MovementProduct[], number] = await MovementProductEntity.createQueryBuilder('qb')
        .where('qb.date >= :startDate')
        .andWhere('qb.date <= :endDate')
        .setParameter('startDate', startDate)
        .setParameter('endDate', endDate)
        .limit(limit ? limit : 0)
        .offset(offset ? offset : 0)
        .orderBy('qb.id', 'ASC')
        .getManyAndCount();

      return { movementProduct, count };
    }
  }

  public async deleteMovementProduct(movementId: number): Promise<Object> {
    const findMovementProduct: MovementProduct = await MovementProductEntity.findOne({ where: { id: movementId } });

    if (!findMovementProduct) throw new HttpException(409, 'categoryId not found');

    await MovementProductEntity.delete({ id: movementId });
    return { success: true };
  }

  public async createMovementProduct(movementProductData: CreateMovementProductDto): Promise<MovementProduct> {
    const createMovementProduct: MovementProduct = await MovementProductEntity.create({ ...movementProductData }).save();

    return createMovementProduct;
  }

  public async getRestStockAllProduct(): Promise<any> {
    const queryBuilder = getConnection()
      .createQueryBuilder()
      .select('pr.id')
      .addSelect('COALESCE(ent.quantity - ot.quantity, 0)', 'rest_stock')
      .addSelect('ent.quantity', 'enter_quantity')
      .addSelect('ot.quantity', 'out_quantity')
      .from(ProductEntity, 'pr')
      .leftJoin(
        subQuery => {
          return subQuery
            .select('dmp.productId')
            .addSelect('COALESCE(SUM(dmp.quantity), 0)', 'quantity')
            .from(DetailMovementProductEntity, 'dmp')
            .leftJoin(MovementProductEntity, 'mov', 'mov.id = dmp.movementProductId')
            .where('mov.isEnter = :isEnter', { isEnter: true })
            .groupBy('dmp.productId');
        },
        'ent',
        'ent.productId = pr.id',
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('dmp.productId')
            .addSelect('COALESCE(SUM(dmp.quantity), 0)', 'quantity')
            .from(DetailMovementProductEntity, 'dmp')
            .leftJoin(MovementProductEntity, 'mov', 'mov.id = dmp.movementProductId')
            .where('mov.isEnter = :isEnter', { isEnter: false })
            .groupBy('dmp.productId');
        },
        'ot',
        'ot.productId = pr.id',
      );

    const result = await queryBuilder.getRawMany();
    return result;
  }
}

export default MovementProductService;
