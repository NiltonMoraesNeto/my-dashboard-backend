import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import {
  CreateSalesDataDto,
  UpdateSalesDataDto,
  CreateSalesDataByBuildingDto,
  UpdateSalesDataByBuildingDto,
  SalesDataResponseDto,
  SalesDataByBuildingResponseDto,
} from './dto/sales.dto';

@ApiTags('sales')
@ApiBearerAuth('access-token')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // Sales Data endpoints
  @Post()
  @ApiOperation({ summary: 'Criar dados de vendas' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Dados de vendas criados com sucesso.',
    type: SalesDataResponseDto,
  })
  createSalesData(@Body() createSalesDataDto: CreateSalesDataDto) {
    return this.salesService.createSalesData(createSalesDataDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os dados de vendas' })
  @ApiQuery({ name: 'year', required: false, description: 'Filtrar por ano' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de dados de vendas.',
    type: [SalesDataResponseDto],
  })
  findAllSalesData(@Query('year') year?: string) {
    if (year) {
      const yearNumber = parseInt(year, 10);
      if (!isNaN(yearNumber)) {
        return this.salesService.findSalesDataByYear(yearNumber);
      }
    }
    return this.salesService.findAllSalesData();
  }

  // Sales Data By Building endpoints (ANTES das rotas com parâmetros dinâmicos)
  @Post('by-building')
  @ApiOperation({ summary: 'Criar dados de vendas por edifício' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Dados de vendas por edifício criados com sucesso.',
    type: SalesDataByBuildingResponseDto,
  })
  createSalesDataByBuilding(
    @Body() createSalesDataByBuildingDto: CreateSalesDataByBuildingDto,
  ) {
    return this.salesService.createSalesDataByBuilding(
      createSalesDataByBuildingDto,
    );
  }

  @Get('by-building')
  @ApiOperation({ summary: 'Listar dados de vendas por edifício' })
  @ApiQuery({
    name: 'buildingName',
    required: false,
    description: 'Filtrar por nome do edifício',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de dados de vendas por edifício.',
    type: [SalesDataByBuildingResponseDto],
  })
  findAllSalesDataByBuilding(@Query('buildingName') buildingName?: string) {
    if (buildingName) {
      return this.salesService.findSalesDataByBuilding(buildingName);
    }
    return this.salesService.findAllSalesDataByBuilding();
  }

  @Get('by-building/:id')
  @ApiOperation({ summary: 'Buscar dados de vendas por edifício por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas por edifício encontrados.',
    type: SalesDataByBuildingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Dados de vendas por edifício não encontrados.',
  })
  findOneSalesDataByBuilding(@Param('id') id: string) {
    return this.salesService.findOneSalesDataByBuilding(id);
  }

  @Patch('by-building/:id')
  @ApiOperation({ summary: 'Atualizar dados de vendas por edifício' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas por edifício atualizados com sucesso.',
    type: SalesDataByBuildingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Dados de vendas por edifício não encontrados.',
  })
  updateSalesDataByBuilding(
    @Param('id') id: string,
    @Body() updateSalesDataByBuildingDto: UpdateSalesDataByBuildingDto,
  ) {
    return this.salesService.updateSalesDataByBuilding(
      id,
      updateSalesDataByBuildingDto,
    );
  }

  @Delete('by-building/:id')
  @ApiOperation({ summary: 'Excluir dados de vendas por edifício' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas por edifício excluídos com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Dados de vendas por edifício não encontrados.',
  })
  removeSalesDataByBuilding(@Param('id') id: string) {
    return this.salesService.removeSalesDataByBuilding(id);
  }

  // Rotas com parâmetros dinâmicos (DEPOIS das rotas específicas)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar dados de vendas por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas encontrados.',
    type: SalesDataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Dados de vendas não encontrados.',
  })
  findOneSalesData(@Param('id') id: string) {
    return this.salesService.findOneSalesData(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de vendas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas atualizados com sucesso.',
    type: SalesDataResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Dados de vendas não encontrados.',
  })
  updateSalesData(
    @Param('id') id: string,
    @Body() updateSalesDataDto: UpdateSalesDataDto,
  ) {
    return this.salesService.updateSalesData(id, updateSalesDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir dados de vendas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados de vendas excluídos com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Dados de vendas não encontrados.',
  })
  removeSalesData(@Param('id') id: string) {
    return this.salesService.removeSalesData(id);
  }
}
