import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  DashboardService,
  MonthlySalesData,
  ComparisonData,
} from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('sales-monthly')
  @ApiOperation({ summary: 'Obter dados de vendas mensais para gráfico' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Ano para filtrar os dados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas mensais retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'JAN' },
          value: { type: 'number', example: 8 },
        },
      },
    },
  })
  async getSalesMontly(
    @Query('year') year?: string,
  ): Promise<MonthlySalesData[]> {
    if (year) {
      const yearNumber = parseInt(year, 10);
      if (!isNaN(yearNumber)) {
        return this.dashboardService.getMonthlySalesData(yearNumber);
      }
    }
    return this.dashboardService.getMonthlySalesData();
  }

  @Get('sales-comparison')
  @ApiOperation({ summary: 'Obter dados comparativos de vendas para gráfico' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Ano para filtrar os dados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados comparativos de vendas retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'JAN' },
          occupied: { type: 'number', example: 15 },
          booked: { type: 'number', example: 10 },
          available: { type: 'number', example: 25 },
        },
      },
    },
  })
  async getSalesComparison(
    @Query('year') year?: string,
  ): Promise<ComparisonData[]> {
    if (year) {
      const yearNumber = parseInt(year, 10);
      if (!isNaN(yearNumber)) {
        return this.dashboardService.getComparisonData(yearNumber);
      }
    }
    return this.dashboardService.getComparisonData();
  }

}
