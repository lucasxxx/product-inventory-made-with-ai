export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: Role;
  imageUrl?: string;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  password?: string;
} 