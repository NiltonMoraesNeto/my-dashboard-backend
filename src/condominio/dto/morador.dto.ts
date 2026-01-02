import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateMoradorDto {
  @ApiProperty({ description: 'Nome completo do morador' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do morador' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do morador', required: false, default: '123456' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'CEP do morador', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'Telefone do morador', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;
}

export class UpdateMoradorDto {
  @ApiProperty({ description: 'Nome completo do morador', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Email do morador', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Nova senha do morador', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'CEP do morador', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'Telefone do morador', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;
}

export class MoradorResponseDto {
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

  @ApiProperty({ required: false })
  condominioId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

