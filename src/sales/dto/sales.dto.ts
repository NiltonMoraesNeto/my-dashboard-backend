import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateSalesDataDto {
  @ApiProperty({ description: 'Nome do mês (ex: JAN, FEV, etc.)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Valor das vendas' })
  @IsInt()
  value: number;

  @ApiProperty({ description: 'Ano das vendas' })
  @IsInt()
  year: number;
}

export class UpdateSalesDataDto {
  @ApiProperty({ description: 'Nome do mês', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Valor das vendas', required: false })
  @IsOptional()
  @IsInt()
  value?: number;

  @ApiProperty({ description: 'Ano das vendas', required: false })
  @IsOptional()
  @IsInt()
  year?: number;
}

export class CreateSalesDataByBuildingDto {
  @ApiProperty({ description: 'Nome do mês (ex: JAN, FEV, etc.)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Valor das vendas' })
  @IsInt()
  value: number;

  @ApiProperty({ description: 'Nome do edifício' })
  @IsString()
  buildingName: string;
}

export class UpdateSalesDataByBuildingDto {
  @ApiProperty({ description: 'Nome do mês', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Valor das vendas', required: false })
  @IsOptional()
  @IsInt()
  value?: number;

  @ApiProperty({ description: 'Nome do edifício', required: false })
  @IsOptional()
  @IsString()
  buildingName?: string;
}

export class SalesDataResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  year: number;
}

export class SalesDataByBuildingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  buildingName: string;
}
