import { Category } from './category.interface';
import { Unit } from './unit.interface';

export interface Product {
  id: number;
  designation: string;
  category: Category;
  limitStock: number;
  unit: Unit;
}
