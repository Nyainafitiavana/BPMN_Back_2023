import { EntityRepository, Repository } from 'typeorm';
import { DetailMovementProductEntity } from '../entities/detailMovementProduct.entity';
import { DetailMovementProduct } from '@/interfaces/detailMovementProduct.interface';
import { CreateDetailMovementProductDto } from '../dtos/detailMovementProduct.dto';

@EntityRepository()
class DetailMovementProductService extends Repository<DetailMovementProductEntity> {
  public async findDetailByBonId(
    movementId: number,
    limit: number,
    offset: number,
  ): Promise<{ detailMovementProduct: DetailMovementProduct[]; count: number }> {
    const [detailMovementProduct, count]: [DetailMovementProduct[], number] = await DetailMovementProductEntity.createQueryBuilder('qb')
      .where('qb.movementProduct = :movementId')
      .setParameter('movementId', movementId)
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .orderBy('qb.id', 'ASC')
      .getManyAndCount();

    return { detailMovementProduct, count };
  }

  public async createDetailMovementProduct(detailMovementProductData: CreateDetailMovementProductDto): Promise<DetailMovementProduct> {
    const createDetailMovementProduct: DetailMovementProduct = await DetailMovementProductEntity.create({ ...detailMovementProductData }).save();

    return createDetailMovementProduct;
  }
}

export default DetailMovementProductService;
