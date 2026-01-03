import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsIn, Min } from 'class-validator';

export class CreateBalanceteMovimentacaoDto {
  @ApiProperty({ description: 'Tipo da movimentação', enum: ['Entrada', 'Saída'] })
  @IsString()
  @IsIn(['Entrada', 'Saída'])
  tipo: string;

  @ApiProperty({ description: 'Data da movimentação' })
  @IsDateString()
  data: string;

  @ApiProperty({ description: 'Valor da movimentação' })
  @IsNumber()
  @Min(0)
  valor: number;

  @ApiProperty({ description: 'Motivo da movimentação' })
  @IsString()
  motivo: string;
}

export class UpdateBalanceteMovimentacaoDto {
  @ApiProperty({ description: 'Tipo da movimentação', required: false, enum: ['Entrada', 'Saída'] })
  @IsOptional()
  @IsString()
  @IsIn(['Entrada', 'Saída'])
  tipo?: string;

  @ApiProperty({ description: 'Data da movimentação', required: false })
  @IsOptional()
  @IsDateString()
  data?: string;

  @ApiProperty({ description: 'Valor da movimentação', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @ApiProperty({ description: 'Motivo da movimentação', required: false })
  @IsOptional()
  @IsString()
  motivo?: string;
}

export class BalanceteMovimentacaoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  data: Date;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  motivo: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

