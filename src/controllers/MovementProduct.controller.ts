import { NextFunction, Request, Response } from 'express';
import Helper from '@utils/helper';
import BaseController from '@controllers/BaseController.controller';
import DetailMovementProductService from '@/services/detailMovementProduct.service';
import MovementProductService from '@/services/movementProduct.service';
import { MovementProduct } from '@/interfaces/movementProduct.interface';
import { CreateMovementProductDto } from '@/dtos/movementProduct.dto';
import { User } from '@/interfaces/users.interface';
import { ValueStatus } from '@/utils/util';

class MovementProductController extends BaseController {
  public movementProductService = new MovementProductService();
  public helper = new Helper();
  public detailMovementProductService = new DetailMovementProductService();

  public getAllMovementProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);
      const startDate: string = '' + req.query.startDate;
      const endDate: string = '' + req.query.startEndDate;

      const { movementProduct, count } = await this.movementProductService.findAllMovementProduct(limit, offset, startDate, endDate);
      const totalRows: number = count;
      const movementProducts: MovementProduct[] = movementProduct;

      res.status(200).json(this.response(true, 'Get All Datas success', movementProducts, totalRows, limit, page));
    } catch (error) {
      next(error);
    }
  };

  public createMovementProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const editor: User = await this.helper.getUser(req);
      let status = 0;

      if (editor.isManager === true) {
        status = ValueStatus.InProgress;
      } else {
        status = ValueStatus.ToValidate;
      }

      const movementData: CreateMovementProductDto = {
        isEnter: req.body.isEnter,
        plannedDate: req.body.plannedDate,
        editor: { id: editor.id },
        status: status,
        date: await this.helper.getDateNowString(),
      };

      const createMovement: MovementProduct = await this.movementProductService.createMovementProduct(movementData);
      await this.detailMovementProductService.createDetailMovementProduct(req, createMovement.id);

      res.status(200).json({ data: createMovement, message: 'Created data success' });
    } catch (error) {
      next(error);
    }
  };

  public deleteMovementProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movementId = Number(req.params.id);
      const deleteMovementProductData: Object = await this.movementProductService.deleteMovementProduct(movementId);

      res.status(200).json({ data: deleteMovementProductData, message: 'deleted success' });
    } catch (error) {
      next(error);
    }
  };

  public getRestStockWithMovement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);

      const { result, total } = await this.movementProductService.getRestStockAllProduct(limit, offset);

      res.status(200).json(this.response(true, 'Get All Datas success', result, total, limit, page));
    } catch (error) {
      next(error);
    }
  };

  public getRuptureStockWithMovement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);

      const { result, total } = await this.movementProductService.getRuptureStock(limit, offset);

      res.status(200).json(this.response(true, 'Get All Datas success', result, total, limit, page));
    } catch (error) {
      next(error);
    }
  };

  public getLateCommande = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);
      const dateNow: string = await this.helper.getDateNowString();

      const { result, count } = await this.movementProductService.getLateCommand(limit, offset, dateNow);

      res.status(200).json(this.response(true, 'Get All Datas success', result, count, limit, page));
    } catch (error) {
      next(error);
    }
  };

  public validatedMovement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movementId = Number(req.params.id);
      const movement: MovementProduct = await this.movementProductService.validateMovement(movementId);

      res.status(200).json(this.response(true, 'Get All Datas success', movement, 1, null, null));
    } catch (error) {
      next(error);
    }
  };

  public rejectedMovement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movementId = Number(req.params.id);
      const movement: MovementProduct = await this.movementProductService.rejectedMovement(movementId);

      res.status(200).json(this.response(true, 'Get All Datas success', movement, 1, null, null));
    } catch (error) {
      next(error);
    }
  };
}
export default MovementProductController;
