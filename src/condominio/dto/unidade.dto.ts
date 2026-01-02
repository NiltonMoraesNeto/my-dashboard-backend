import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUnidadeDto {
  @ApiProperty({ description: 'Número da unidade' })
  @IsString()
  numero: string;

  @ApiProperty({ description: 'Bloco da unidade', required: false })
  @IsOptional()
  @IsString()
  bloco?: string;

  @ApiProperty({ description: 'Número do apartamento', required: false })
  @IsOptional()
  @IsString()
  apartamento?: string;

  @ApiProperty({ description: 'Tipo da unidade (Apartamento, Cobertura, Loja, etc.)', required: false })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ description: 'Status da unidade', required: false, default: 'Ativo' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Nome do proprietário', required: false })
  @IsOptional()
  @IsString()
  proprietario?: string;

  @ApiProperty({ description: 'Telefone do proprietário', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Email do proprietário', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'ID do morador vinculado', required: false })
  @IsOptional()
  @IsString()
  moradorId?: string;
}

export class UpdateUnidadeDto {
  @ApiProperty({ description: 'Número da unidade', required: false })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty({ description: 'Bloco da unidade', required: false })
  @IsOptional()
  @IsString()
  bloco?: string;

  @ApiProperty({ description: 'Número do apartamento', required: false })
  @IsOptional()
  @IsString()
  apartamento?: string;

  @ApiProperty({ description: 'Tipo da unidade', required: false })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ description: 'Status da unidade', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Nome do proprietário', required: false })
  @IsOptional()
  @IsString()
  proprietario?: string;

  @ApiProperty({ description: 'Telefone do proprietário', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Email do proprietário', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'ID do morador vinculado', required: false })
  @IsOptional()
  @IsString()
  moradorId?: string;
}

export class UnidadeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  numero: string;

  @ApiProperty({ required: false })
  bloco?: string;

  @ApiProperty({ required: false })
  apartamento?: string;

  @ApiProperty({ required: false })
  tipo?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  proprietario?: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

