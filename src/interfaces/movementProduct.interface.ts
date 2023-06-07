import { User } from './users.interface';

export interface MovementProduct {
  id: number;
  isEnter: Boolean;
  editor: User;
  status: string;
  plannedDate: string;
}
