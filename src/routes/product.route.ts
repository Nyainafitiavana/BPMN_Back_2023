import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ProductController from '@/controllers/product.controller';
import { CreateProductDto } from '@/dtos/product.dto';

class ProductRoute implements Routes {
  public path = '/api/product';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.productController.getAllProduct);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.productController.getProductById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateProductDto, 'body'), this.productController.createProduct);
    this.router.put(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      validationMiddleware(CreateProductDto, 'body', true),
      this.productController.updateProduct,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.productController.deleteProduct);
  }
}

export default ProductRoute;
