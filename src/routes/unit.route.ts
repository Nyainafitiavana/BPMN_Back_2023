import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import UnitController from '@/controllers/unit.controller';
import { CreateUnitDto } from '@/dtos/unit.dto';

class UnitRoute implements Routes {
  public path = '/api/unit';
  public router = Router();
  public unitController = new UnitController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.unitController.getAllUnit);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.unitController.getUnitById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateUnitDto, 'body'), this.unitController.createUnit);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateUnitDto, 'body', true), this.unitController.updateUnit);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.unitController.deleteUnit);
  }
}

export default UnitRoute;
