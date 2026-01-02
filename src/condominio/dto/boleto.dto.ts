import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsInt, Min } from 'class-validator';

export class CreateBoletoDto {
  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  unidadeId: string;

  @ApiProperty({ description: 'Mês do boleto (1-12)' })
  @IsInt()
  @Min(1)
  mes: number;

  @ApiProperty({ description: 'Ano do boleto' })
  @IsInt()
  @Min(2000)
  ano: number;

  @ApiProperty({ description: 'Valor do boleto' })
  @IsNumber()
  @Min(0)
  valor: number;

  @ApiProperty({ description: 'Data de vencimento' })
  @IsDateString()
  vencimento: string;

  @ApiProperty({ description: 'Código de barras', required: false })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @ApiProperty({ description: 'Nosso número', required: false })
  @IsOptional()
  @IsString()
  nossoNumero?: string;

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

  @ApiProperty({ description: 'Mês do boleto (1-12)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  mes?: number;

  @ApiProperty({ description: 'Ano do boleto', required: false })
  @IsOptional()
  @IsInt()
  @Min(2000)
  ano?: number;

  @ApiProperty({ description: 'Valor do boleto', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @ApiProperty({ description: 'Data de vencimento', required: false })
  @IsOptional()
  @IsDateString()
  vencimento?: string;

  @ApiProperty({ description: 'Código de barras', required: false })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @ApiProperty({ description: 'Nosso número', required: false })
  @IsOptional()
  @IsString()
  nossoNumero?: string;

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
  mes: number;

  @ApiProperty()
  ano: number;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  vencimento: Date;

  @ApiProperty({ required: false })
  codigoBarras?: string;

  @ApiProperty({ required: false })
  nossoNumero?: string;

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

