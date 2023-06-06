import { EntityRepository, Repository } from 'typeorm';
import { HttpException } from '@/exceptions/HttpException';
import { UnitEntity } from '@/entities/unit.entity';
import { Unit } from '@/interfaces/unit.interface';
import { CreateUnitDto } from '@/dtos/unit.dto';

@EntityRepository()
class UnitService extends Repository<UnitEntity> {
  public async findAllUnit(limit: number, offset: number): Promise<{ unit: Unit[]; count: number }> {
    const [unit, count]: [Unit[], number] = await UnitEntity.createQueryBuilder('qb')
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .orderBy('qb.id', 'ASC')
      .getManyAndCount();

    return { unit, count };
  }

  public async searchUnit(limit: number, offset: number, key: string): Promise<{ unit: Unit[]; count: number }> {
    const [unit, count]: [Unit[], number] = await UnitEntity.createQueryBuilder('unt')
      .where('LOWER(unt.designation) LIKE :desi', { desi: `%${key.toLowerCase()}%` })
      .limit(limit ? limit : 0)
      .offset(offset ? offset : 0)
      .getManyAndCount();

    return { unit, count };
  }

  public async getUnitById(unitId: number): Promise<Unit> {
    const unit: Unit = await UnitEntity.findOne({
      where: { id: unitId },
    });

    return unit;
  }

  public async updateUnit(unitId: number, unitData: CreateUnitDto): Promise<Unit> {
    const findUnit: Unit = await UnitEntity.findOne({ where: { id: unitId } });
    if (!findUnit) throw new HttpException(409, 'Category not found');

    await UnitEntity.update(unitId, { ...unitData });

    const updateUnit: Unit = await UnitEntity.findOne({ where: { id: unitId } });
    return updateUnit;
  }

  public async deleteUnit(unitId: number): Promise<Object> {
    const findUnit: Unit = await UnitEntity.findOne({ where: { id: unitId } });

    if (!findUnit) throw new HttpException(409, 'unitId not found');

    await UnitEntity.delete({ id: unitId });
    return { success: true };
  }

  public async createUnit(unitData: CreateUnitDto): Promise<Unit> {
    const createUnit: Unit = await UnitEntity.create({ ...unitData }).save();

    return createUnit;
  }
}

export default UnitService;
