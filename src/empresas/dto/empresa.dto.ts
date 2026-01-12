import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty({ description: 'Nome da empresa' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'CNPJ da empresa', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ description: 'Email de contato', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Licença ativa', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @ApiProperty({ description: 'Data de início da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataInicio?: Date;

  @ApiProperty({ description: 'Data de fim da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: Date;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class UpdateEmpresaDto {
  @ApiProperty({ description: 'Nome da empresa', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'CNPJ da empresa', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ description: 'Email de contato', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Licença ativa', required: false })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @ApiProperty({ description: 'Data de início da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataInicio?: Date;

  @ApiProperty({ description: 'Data de fim da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: Date;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class EmpresaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ required: false })
  cnpj?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty()
  ativa: boolean;

  @ApiProperty()
  dataInicio: Date;

  @ApiProperty({ required: false })
  dataFim?: Date;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
