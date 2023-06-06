import { NextFunction, Request, Response } from 'express';
import Helper from '@utils/helper';
import BaseController from '@controllers/BaseController.controller';
import { ApiResponse } from '@interfaces/response.interface';
import UnitService from '@/services/unit.service';
import { CreateUnitDto } from '@/dtos/unit.dto';
import { Unit } from '@/interfaces/unit.interface';

class UnitController extends BaseController {
  public unitService = new UnitService();
  public helper = new Helper();

  public createUnit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const objectUnit: CreateUnitDto = req.body;
      const createUnit: Unit = await this.unitService.createUnit(objectUnit);

      res.status(201).json({ data: createUnit, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  public getAllUnit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);
      const keys: string = '' + req.query.key;

      if (keys != '') {
        const { unit, count } = await this.unitService.searchUnit(limit, offset, keys);
        const totalRows: number = count;
        const units: Unit[] = unit;

        res.status(200).json(this.response(true, 'Get All Datas success', units, totalRows, limit, page));
      } else {
        const { unit, count } = await this.unitService.findAllUnit(limit, offset);
        const totalRows: number = count;
        const units: Unit[] = unit;

        res.status(200).json(this.response(true, 'Get All Datas success', units, totalRows, limit, page));
      }
    } catch (error) {
      next(error);
    }
  };

  public getUnitById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unitId = Number(req.params.id);
      const findUnit: Unit = await this.unitService.getUnitById(unitId);

      const data: ApiResponse = await this.response(true, 'Get All Datas success', findUnit, 1, null, null);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  public updateUnit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unitId = Number(req.params.id);
      const unitData: CreateUnitDto = req.body;
      const updateUnitData: Unit = await this.unitService.updateUnit(unitId, unitData);

      res.status(200).json({ data: updateUnitData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUnit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unitId = Number(req.params.id);
      const deleteUnitData: Object = await this.unitService.deleteUnit(unitId);

      res.status(200).json({ data: deleteUnitData, message: 'deleted success' });
    } catch (error) {
      next(error);
    }
  };
}
export default UnitController;
