import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import MovementProductController from '@/controllers/MovementProduct.controller';

class MovementProductRoute implements Routes {
  public path = '/api/movement-product';
  public router = Router();
  public movementProductController = new MovementProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.movementProductController.getAllMovementProduct);
    this.router.get(`/api/rest-stock`, authMiddleware, this.movementProductController.getRestStockWithMovement);
    this.router.post(`${this.path}`, authMiddleware, this.movementProductController.createMovementProduct);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.movementProductController.deleteMovementProduct);
  }
}

export default MovementProductRoute;
