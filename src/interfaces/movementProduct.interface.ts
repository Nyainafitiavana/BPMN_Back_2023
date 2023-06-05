import { User } from './users.interface';

export interface MovementProduct {
  id: number;
  isEnter: Boolean;
  editor: User;
  status: string;
  priceWalk: number;
  plannedDate: string;
}
