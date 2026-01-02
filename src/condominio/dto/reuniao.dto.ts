import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateReuniaoDto {
  @ApiProperty({ description: 'Título da reunião' })
  @IsString()
  titulo: string;

  @ApiProperty({ description: 'Data da reunião' })
  @IsDateString()
  data: string;

  @ApiProperty({ description: 'Hora da reunião' })
  @IsString()
  hora: string;

  @ApiProperty({ description: 'Local da reunião', required: false })
  @IsOptional()
  @IsString()
  local?: string;

  @ApiProperty({ description: 'Tipo da reunião', required: false, default: 'Assembleia' })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ description: 'Pauta da reunião', required: false })
  @IsOptional()
  @IsString()
  pauta?: string;

  @ApiProperty({ description: 'Status da reunião', required: false, default: 'Agendada' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateReuniaoDto {
  @ApiProperty({ description: 'Título da reunião', required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ description: 'Data da reunião', required: false })
  @IsOptional()
  @IsDateString()
  data?: string;

  @ApiProperty({ description: 'Hora da reunião', required: false })
  @IsOptional()
  @IsString()
  hora?: string;

  @ApiProperty({ description: 'Local da reunião', required: false })
  @IsOptional()
  @IsString()
  local?: string;

  @ApiProperty({ description: 'Tipo da reunião', required: false })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({ description: 'Pauta da reunião', required: false })
  @IsOptional()
  @IsString()
  pauta?: string;

  @ApiProperty({ description: 'Status da reunião', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class ReuniaoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  data: Date;

  @ApiProperty()
  hora: string;

  @ApiProperty({ required: false })
  local?: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty({ required: false })
  pauta?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

