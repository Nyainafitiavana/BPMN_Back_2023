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
      .leftJoinAndSelect('qb.movementProduct', 'mp')
      .where('qb.movementProduct = :movementId')
      .setParameter('movementId', movementId)
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .orderBy('qb.id', 'ASC')
      .getManyAndCount();

    return { detailMovementProduct, count };
  }

  public async createDetailMovementProduct(req: any, movementId: number): Promise<object> {
    req.body.detailMovement.map(async function (item) {
      const detailMovementProductData: CreateDetailMovementProductDto = {
        movementProduct: { id: movementId },
        product: item.product,
        priceWalk: item.priceWalk,
        quantity: item.quantity,
      };

      await DetailMovementProductEntity.create({ ...detailMovementProductData }).save();
    });

    return { success: true };
  }
}

export default DetailMovementProductService;
