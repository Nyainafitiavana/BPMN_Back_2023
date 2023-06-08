import { EntityRepository, Repository } from 'typeorm';
import { HttpException } from '@/exceptions/HttpException';
import { MovementProduct } from '@/interfaces/movementProduct.interface';
import { MovementProductEntity } from '@/entities/movementProduct.entity';
import { CreateMovementProductDto } from '@/dtos/movementProduct.dto';
import Helper from '@/utils/helper';

@EntityRepository()
class MovementProductService extends Repository<MovementProductEntity> {
  public helper = new Helper();
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

  public async getRestStockAllProduct(limit: number, offset: number): Promise<{ result: object; total: number }> {
    const query = `
      SELECT pr."id", pr.designation, 
      unt.designation AS unit, ct.designation as category, 
      pr."limitStock", COALESCE(COALESCE(ent.quantity, 0) - COALESCE(ot.quantity, 0), 0) as rest_stock, 
      ent.quantity as enter_quantity,
      ot.quantity as out_quantity
      FROM product_entity pr
      LEFT JOIN unit_entity unt ON unt."id" = pr."unitId"
      LEFT JOIN category_entity ct ON ct."id" = pr."categoryId"
      LEFT JOIN (
        SELECT dmp."productId", COALESCE(SUM(dmp.quantity), 0) as quantity
        FROM detail_movement_product_entity dmp
        LEFT JOIN movement_product_entity mov ON mov."id" = dmp."movementProductId"
        WHERE mov."isEnter" = true AND mov.status = 3
        GROUP BY dmp."productId"
      ) ent ON ent."productId" = pr."id"
      LEFT JOIN (
        SELECT dmp."productId", COALESCE(SUM(dmp.quantity), 0) as quantity
        FROM detail_movement_product_entity dmp
        LEFT JOIN movement_product_entity mov ON mov."id" = dmp."movementProductId"
        WHERE mov."isEnter" = FALSE AND mov.status = 3
        GROUP BY dmp."productId"
      ) ot ON ot."productId" = pr."id"    
      LIMIT $1
      OFFSET $2;
    `;

    const result = await this.helper.executSQLQuery(query, limit, offset);
    const count = await this.helper.executSQLQuery(query, null, null);
    return { result: result, total: Object.keys(count).length };
  }

  public async getRuptureStock(limit: number, offset: number): Promise<{ result: object; total: number }> {
    const query = `
    SELECT pr."id", pr.designation, 
    unt.designation AS unit, ct.designation as category, 
    pr."limitStock", COALESCE(COALESCE(ent.quantity, 0) - COALESCE(ot.quantity, 0), 0) as rest_stock, 
    ent.quantity as enter_quantity,
    ot.quantity as out_quantity
    FROM product_entity pr
    LEFT JOIN unit_entity unt ON unt."id" = pr."unitId"
    LEFT JOIN category_entity ct ON ct."id" = pr."categoryId"
    LEFT JOIN (
      SELECT dmp."productId", COALESCE(SUM(dmp.quantity), 0) as quantity
      FROM detail_movement_product_entity dmp
      LEFT JOIN movement_product_entity mov ON mov."id" = dmp."movementProductId"
      WHERE mov."isEnter" = true AND mov.status = 3
      GROUP BY dmp."productId"
    ) ent ON ent."productId" = pr."id"
    LEFT JOIN (
      SELECT dmp."productId", COALESCE(SUM(dmp.quantity), 0) as quantity
      FROM detail_movement_product_entity dmp
      LEFT JOIN movement_product_entity mov ON mov."id" = dmp."movementProductId"
      WHERE mov."isEnter" = FALSE AND mov.status = 3
      GROUP BY dmp."productId"
    ) ot ON ot."productId" = pr."id"
    WHERE COALESCE(COALESCE(ent.quantity, 0) - COALESCE(ot.quantity, 0), 0) <= pr."limitStock"
    LIMIT $1
    OFFSET $2;
    `;

    const result = await this.helper.executSQLQuery(query, limit, offset);
    const count = await this.helper.executSQLQuery(query, null, null);
    return { result: result, total: Object.keys(count).length };
  }
}

export default MovementProductService;
