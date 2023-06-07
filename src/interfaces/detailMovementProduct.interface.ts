import { MovementProduct } from './movementProduct.interface';
import { Product } from './product.interface';

export interface DetailMovementProduct {
  id: number;
  movementProduct: MovementProduct;
  product: Product;
  priceWalk: number;
  quantity: number;
}
