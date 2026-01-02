import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateAvisoDto {
  @ApiProperty({ description: 'Título do aviso' })
  @IsString()
  titulo: string;

  @ApiProperty({ description: 'Descrição do aviso' })
  @IsString()
  descricao: string;

  @ApiProperty({ description: 'Tipo do aviso', required: false, default: 'Informativo' })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ description: 'Data de início do aviso' })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ description: 'Data de fim do aviso', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({ description: 'Se o aviso está em destaque', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  destaque?: boolean;
}

export class UpdateAvisoDto {
  @ApiProperty({ description: 'Título do aviso', required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ description: 'Descrição do aviso', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Tipo do aviso', required: false })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ description: 'Data de início do aviso', required: false })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({ description: 'Data de fim do aviso', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({ description: 'Se o aviso está em destaque', required: false })
  @IsOptional()
  @IsBoolean()
  destaque?: boolean;
}

export class AvisoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  dataInicio: Date;

  @ApiProperty({ required: false })
  dataFim?: Date;

  @ApiProperty()
  destaque: boolean;

  @ApiProperty({ required: false })
  lido?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

