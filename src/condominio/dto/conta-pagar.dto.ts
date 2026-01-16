import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContaPagarDto {
  @ApiProperty({ description: 'Descrição da conta' })
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Valor da conta' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber({}, { message: 'valor must be a number conforming to the specified constraints' })
  @Min(0, { message: 'valor must not be less than 0' })
  valor: number;

  @ApiProperty({ description: 'Data de vencimento' })
  @IsDateString()
  vencimento: string;

  @ApiProperty({ description: 'Mês da conta (1-12)' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsInt({ message: 'mes must be an integer number' })
  @Min(1, { message: 'mes must not be less than 1' })
  mes: number;

  @ApiProperty({ description: 'Ano da conta' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsInt({ message: 'ano must be an integer number' })
  @Min(2000, { message: 'ano must not be less than 2000' })
  ano: number;

  @ApiProperty({ description: 'Categoria da conta', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ description: 'Status da conta', required: false, default: 'Pendente' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'ID da unidade relacionada', required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ description: 'Caminho do arquivo anexo', required: false })
  @IsOptional()
  @IsString()
  anexo?: string;
}

export class UpdateContaPagarDto {
  @ApiProperty({ description: 'Descrição da conta', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Valor da conta', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value !== undefined && typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsNumber({}, { message: 'valor must be a number conforming to the specified constraints' })
  @Min(0, { message: 'valor must not be less than 0' })
  valor?: number;

  @ApiProperty({ description: 'Data de vencimento', required: false })
  @IsOptional()
  @IsDateString()
  vencimento?: string;

  @ApiProperty({ description: 'Mês da conta (1-12)', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value !== undefined && typeof value === 'string') {
      const num = parseInt(value, 10);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsInt({ message: 'mes must be an integer number' })
  @Min(1, { message: 'mes must not be less than 1' })
  mes?: number;

  @ApiProperty({ description: 'Ano da conta', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value !== undefined && typeof value === 'string') {
      const num = parseInt(value, 10);
      return isNaN(num) ? value : num;
    }
    return value;
  })
  @IsInt({ message: 'ano must be an integer number' })
  @Min(2000, { message: 'ano must not be less than 2000' })
  ano?: number;

  @ApiProperty({ description: 'Categoria da conta', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({ description: 'Status da conta', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'ID da unidade relacionada', required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ description: 'Caminho do arquivo anexo', required: false })
  @IsOptional()
  @IsString()
  anexo?: string;
}

export class ContaPagarResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  vencimento: Date;

  @ApiProperty()
  mes: number;

  @ApiProperty()
  ano: number;

  @ApiProperty({ required: false })
  categoria?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  unidadeId?: string;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty({ required: false })
  anexo?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

