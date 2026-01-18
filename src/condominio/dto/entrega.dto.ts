import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateEntregaDto {
  @ApiProperty({ description: 'Título da entrega', required: false, default: 'Nova entrega' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ description: 'Data e hora da entrega' })
  @IsDateString()
  dataHora: string;

  @ApiProperty({ description: 'Nome do recebedor' })
  @IsString()
  nomeRecebedor: string;

  @ApiProperty({ description: 'Quem recebeu a entrega', enum: ['portaria', 'zelador', 'morador'] })
  @IsString()
  @IsIn(['portaria', 'zelador', 'morador'], {
    message: 'recebidoPor deve ser: portaria, zelador ou morador',
  })
  recebidoPor: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  unidadeId: string;

  @ApiProperty({ description: 'Arquivo anexo (foto do produto)', type: 'string', format: 'binary', required: false })
  @IsOptional()
  anexo?: Express.Multer.File;
}

export class UpdateEntregaDto {
  @ApiProperty({ description: 'Título da entrega', required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ description: 'Data e hora da entrega', required: false })
  @IsOptional()
  @IsDateString()
  dataHora?: string;

  @ApiProperty({ description: 'Nome do recebedor', required: false })
  @IsOptional()
  @IsString()
  nomeRecebedor?: string;

  @ApiProperty({
    description: 'Quem recebeu a entrega',
    enum: ['portaria', 'zelador', 'morador'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['portaria', 'zelador', 'morador'], {
    message: 'recebidoPor deve ser: portaria, zelador ou morador',
  })
  recebidoPor?: string;

  @ApiProperty({ description: 'ID da unidade', required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;

  @ApiProperty({ description: 'Arquivo anexo (foto do produto)', type: 'string', format: 'binary', required: false })
  @IsOptional()
  anexo?: Express.Multer.File;
}

export class EntregaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  dataHora: Date;

  @ApiProperty()
  nomeRecebedor: string;

  @ApiProperty()
  recebidoPor: string;

  @ApiProperty()
  unidadeId: string;

  @ApiProperty({ required: false })
  anexo?: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  empresaId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
