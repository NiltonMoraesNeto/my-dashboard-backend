import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBoletoDto {
  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  unidadeId: string;

  @ApiProperty({ description: 'Descrição do boleto' })
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Valor do boleto' })
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

  @ApiProperty({ description: 'Arquivo PDF do boleto', type: 'string', format: 'binary', required: false })
  @IsOptional()
  arquivo?: Express.Multer.File;

  @ApiProperty({ description: 'Status do boleto', required: false, default: 'Pendente' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Data de pagamento', required: false })
  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class UpdateBoletoDto {
  @ApiProperty({ description: 'ID da unidade', required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;

  @ApiProperty({ description: 'Descrição do boleto', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Valor do boleto', required: false })
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

  @ApiProperty({ description: 'Arquivo PDF do boleto', type: 'string', format: 'binary', required: false })
  @IsOptional()
  arquivo?: Express.Multer.File;

  arquivoPdf?: string; // Campo interno para armazenar o caminho após upload

  @ApiProperty({ description: 'Status do boleto', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Data de pagamento', required: false })
  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class BoletoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  unidadeId: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  vencimento: Date;

  @ApiProperty({ required: false })
  arquivoPdf?: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  dataPagamento?: Date;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

