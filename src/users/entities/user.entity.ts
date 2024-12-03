import { Status } from '../../enums/status.enum';

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  status: Status;
  created_at?: Date;
  updated_at?: Date;
}
