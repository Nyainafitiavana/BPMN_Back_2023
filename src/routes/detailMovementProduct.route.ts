import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import DetailMovementProductController from '@/controllers/detailMovementProduct.controller';

class DetailMovementProductRoute implements Routes {
  public path = '/api/detail-movement';
  public router = Router();
  public detailMovementProductController = new DetailMovementProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.detailMovementProductController.getDetailMovementByMovementId);
  }
}

export default DetailMovementProductRoute;
