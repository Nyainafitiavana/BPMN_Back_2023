import { NextFunction, Request, Response } from 'express';
import Helper from '@utils/helper';
import BaseController from '@controllers/BaseController.controller';
import { Product } from '../interfaces/product.interface';
import ProductService from '@/services/product.service';
import { CreateProductDto } from '@/dtos/product.dto';

class ProductController extends BaseController {
  public productService = new ProductService();
  public helper = new Helper();

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const objectProduct: CreateProductDto = req.body;
      const createProduct: Product = await this.productService.createProduct(objectProduct);

      res.status(201).json({ data: createProduct, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getAllProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit: number = +req.query.limit;
      const page: number = +req.query.page;
      const offset: number = await this.helper.calculOffset(limit, page);
      const keys: string = '' + req.query.key;

      if (keys != '') {
        const { product, count } = await this.productService.searchProduct(limit, offset, keys);
        const totalRows: number = count;
        const products: Product[] = product;

        res.status(200).json(this.response(true, 'Get All Datas success', products, totalRows, limit, page));
      } else {
        const { product, count } = await this.productService.findAllProduct(limit, offset);
        const totalRows: number = count;
        const products: Product[] = product;

        res.status(200).json(this.response(true, 'Get All Datas success', products, totalRows, limit, page));
      }
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const findProduct: Product = await this.productService.getProductById(productId);

      res.status(200).json(this.response(true, 'Get One Datas success', findProduct, 1, null, null));
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const productData: CreateProductDto = req.body;
      const updateProductData: Product = await this.productService.updateProduct(productId, productData);

      res.status(200).json({ data: updateProductData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      const deleteProductData: Object = await this.productService.deleteProduct(productId);

      res.status(200).json({ data: deleteProductData, message: 'deleted success' });
    } catch (error) {
      next(error);
    }
  };
}
export default ProductController;
