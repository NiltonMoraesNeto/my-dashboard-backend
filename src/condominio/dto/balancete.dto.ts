import { ApiProperty } from '@nestjs/swagger';

export class BalanceteResponseDto {
  @ApiProperty()
  mes: number;

  @ApiProperty()
  ano: number;

  @ApiProperty()
  receitas: number;

  @ApiProperty()
  despesas: number;

  @ApiProperty()
  saldo: number;
}

export class BalanceteQueryDto {
  @ApiProperty({ description: 'Ano para o balancete', required: false })
  ano?: number;

  @ApiProperty({ description: 'Mês para o balancete', required: false })
  mes?: number;
}

