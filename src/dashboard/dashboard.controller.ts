import { Controller, Get, Query, Post, HttpStatus } from '@nestjs/common';
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

  @Post('seed-data')
  @ApiOperation({ summary: 'Popular dados de exemplo para o dashboard' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Ano para popular os dados (padrão: ano atual)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de exemplo populados com sucesso',
  })
  async seedData(@Query('year') year?: string) {
    const currentYear = year ? parseInt(year, 10) : new Date().getFullYear();
    await this.dashboardService.seedMonthlyData(currentYear);
    return {
      status: HttpStatus.OK,
      message: `Dados de exemplo populados para o ano ${currentYear}`,
    };
  }
}
