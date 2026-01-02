import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsInt, Min } from 'class-validator';

export class CreateContaPagarDto {
  @ApiProperty({ description: 'Descrição da conta' })
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Valor da conta' })
  @IsNumber()
  @Min(0)
  valor: number;

  @ApiProperty({ description: 'Data de vencimento' })
  @IsDateString()
  vencimento: string;

  @ApiProperty({ description: 'Mês da conta (1-12)' })
  @IsInt()
  @Min(1)
  mes: number;

  @ApiProperty({ description: 'Ano da conta' })
  @IsInt()
  @Min(2000)
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
}

export class UpdateContaPagarDto {
  @ApiProperty({ description: 'Descrição da conta', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Valor da conta', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @ApiProperty({ description: 'Data de vencimento', required: false })
  @IsOptional()
  @IsDateString()
  vencimento?: string;

  @ApiProperty({ description: 'Mês da conta (1-12)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  mes?: number;

  @ApiProperty({ description: 'Ano da conta', required: false })
  @IsOptional()
  @IsInt()
  @Min(2000)
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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

