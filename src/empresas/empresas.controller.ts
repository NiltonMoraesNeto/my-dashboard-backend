import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EmpresasService } from './empresas.service';
import {
  CreateEmpresaDto,
  UpdateEmpresaDto,
  EmpresaResponseDto,
} from './dto/empresa.dto';
import { UseSuperAdminGuard } from '../auth/super-admin.decorator';

@ApiTags('empresas')
@ApiBearerAuth('access-token')
@Controller('empresas')
@UseSuperAdminGuard()
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova empresa' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Empresa criada com sucesso.',
    type: EmpresaResponseDto,
  })
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de empresas.',
    type: [EmpresaResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';

    return this.empresasService.findAll(pageNumber, limit, searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa encontrada.',
    type: EmpresaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa atualizada com sucesso.',
    type: EmpresaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada.',
  })
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Empresa excluída com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada.',
  })
  remove(@Param('id') id: string) {
    return this.empresasService.remove(id);
  }

  @Put(':id/toggle-ativa')
  @ApiOperation({ summary: 'Ativar/Desativar licença da empresa' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status da licença alterado com sucesso.',
    type: EmpresaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Empresa não encontrada.',
  })
  toggleAtiva(@Param('id') id: string) {
    return this.empresasService.toggleAtiva(id);
  }
}
