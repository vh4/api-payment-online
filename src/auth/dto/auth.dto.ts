import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator'

export interface Auth {
  username: string
  password: string
  token?: string
}

export interface UserAuth {
  id?: string
  name: string
  username: string
  email: string
  password: string
  picture?: string
  token?: string
}

export class UserAuthDto {
  @IsNotEmpty()
  username: string
  @IsNotEmpty()
  password: string
  @IsOptional()
  token?: string
}
