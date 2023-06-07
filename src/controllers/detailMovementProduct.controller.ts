import { NextFunction, Request, Response } from 'express';
import Helper from '@utils/helper';
import BaseController from '@controllers/BaseController.controller';
import DetailMovementProductService from '@/services/detailMovementProduct.service';
import { DetailMovementProduct } from '@/interfaces/detailMovementProduct.interface';

class DetailMovementProductController extends BaseController {
  public detailMovementProductService = new DetailMovementProductService();
  public helper = new Helper();

  public getDetailMovementByMovementId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);
      const movementId = Number(req.params.id);

      const { detailMovementProduct, count } = await this.detailMovementProductService.findDetailByBonId(movementId, limit, offset);
      const totalRows: number = count;
      const detailMovement: DetailMovementProduct[] = detailMovementProduct;

      res.status(200).json(this.response(true, 'Get All Datas success', detailMovement, totalRows, limit, page));
    } catch (error) {
      next(error);
    }
  };
}
export default DetailMovementProductController;
