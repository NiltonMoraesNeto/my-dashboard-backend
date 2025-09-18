import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsInt,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'ID do perfil do usuário' })
  @IsInt()
  perfilId: number;

  @ApiProperty({ description: 'CEP do usuário', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'Avatar do usuário', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Email do usuário', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'ID do perfil do usuário', required: false })
  @IsOptional()
  @IsInt()
  perfilId?: number;

  @ApiProperty({ description: 'CEP do usuário', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'Avatar do usuário', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  perfilId: number;

  @ApiProperty({ required: false })
  cep?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
