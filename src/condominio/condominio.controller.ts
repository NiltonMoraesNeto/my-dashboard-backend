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
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CondominioService } from './condominio.service';
import {
  CreateUnidadeDto,
  UpdateUnidadeDto,
  UnidadeResponseDto,
} from './dto/unidade.dto';
import {
  CreateContaPagarDto,
  UpdateContaPagarDto,
  ContaPagarResponseDto,
} from './dto/conta-pagar.dto';
import {
  CreateBoletoDto,
  UpdateBoletoDto,
  BoletoResponseDto,
} from './dto/boleto.dto';
import {
  CreateReuniaoDto,
  UpdateReuniaoDto,
  ReuniaoResponseDto,
} from './dto/reuniao.dto';
import {
  CreateAvisoDto,
  UpdateAvisoDto,
  AvisoResponseDto,
} from './dto/aviso.dto';
import {
  BalanceteResponseDto,
  BalanceteQueryDto,
} from './dto/balancete.dto';
import {
  CreateMoradorDto,
  UpdateMoradorDto,
  MoradorResponseDto,
} from './dto/morador.dto';

@ApiTags('condominio')
@ApiBearerAuth('access-token')
@Controller('condominio')
export class CondominioController {
  constructor(private readonly condominioService: CondominioService) {}

  // ========== UNIDADES ==========
  @Post('unidades')
  @ApiOperation({ summary: 'Criar uma nova unidade' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Unidade criada com sucesso.',
    type: UnidadeResponseDto,
  })
  createUnidade(@Req() req: Request, @Body() createUnidadeDto: CreateUnidadeDto) {
    const userId = (req.user as any).userId;
    return this.condominioService.createUnidade(userId, createUnidadeDto);
  }

  @Get('unidades')
  @ApiOperation({ summary: 'Listar todas as unidades' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de unidades.',
    type: [UnidadeResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAllUnidades(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('search') search?: string,
  ) {
    const userId = (req.user as any).userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';
    
    return this.condominioService.findAllUnidades(userId, pageNumber, limit, searchTerm);
  }

  @Get('unidades/:id')
  @ApiOperation({ summary: 'Buscar unidade por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade encontrada.',
    type: UnidadeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade não encontrada.',
  })
  findOneUnidade(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.findOneUnidade(userId, id);
  }

  @Patch('unidades/:id')
  @ApiOperation({ summary: 'Atualizar unidade' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade atualizada com sucesso.',
    type: UnidadeResponseDto,
  })
  updateUnidade(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUnidadeDto: UpdateUnidadeDto,
  ) {
    const userId = (req.user as any).userId;
    return this.condominioService.updateUnidade(userId, id, updateUnidadeDto);
  }

  @Delete('unidades/:id')
  @ApiOperation({ summary: 'Excluir unidade' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade excluída com sucesso.',
  })
  removeUnidade(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.removeUnidade(userId, id);
  }

  // ========== CONTAS A PAGAR ==========
  @Post('contas-pagar')
  @ApiOperation({ summary: 'Criar uma nova conta a pagar' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conta a pagar criada com sucesso.',
    type: ContaPagarResponseDto,
  })
  createContaPagar(@Req() req: Request, @Body() createContaPagarDto: CreateContaPagarDto) {
    const userId = (req.user as any).userId;
    return this.condominioService.createContaPagar(userId, createContaPagarDto);
  }

  @Get('contas-pagar')
  @ApiOperation({ summary: 'Listar todas as contas a pagar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de contas a pagar.',
    type: [ContaPagarResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  findAllContasPagar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
  ) {
    const userId = (req.user as any).userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;
    
    return this.condominioService.findAllContasPagar(
      userId,
      pageNumber,
      limit,
      mesNumber,
      anoNumber,
    );
  }

  @Get('contas-pagar/:id')
  @ApiOperation({ summary: 'Buscar conta a pagar por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conta a pagar encontrada.',
    type: ContaPagarResponseDto,
  })
  findOneContaPagar(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.findOneContaPagar(userId, id);
  }

  @Patch('contas-pagar/:id')
  @ApiOperation({ summary: 'Atualizar conta a pagar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conta a pagar atualizada com sucesso.',
    type: ContaPagarResponseDto,
  })
  updateContaPagar(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateContaPagarDto: UpdateContaPagarDto,
  ) {
    const userId = (req.user as any).userId;
    return this.condominioService.updateContaPagar(userId, id, updateContaPagarDto);
  }

  @Delete('contas-pagar/:id')
  @ApiOperation({ summary: 'Excluir conta a pagar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conta a pagar excluída com sucesso.',
  })
  removeContaPagar(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.removeContaPagar(userId, id);
  }

  // ========== BOLETOS ==========
  @Post('boletos')
  @ApiOperation({ summary: 'Criar um novo boleto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Boleto criado com sucesso.',
    type: BoletoResponseDto,
  })
  createBoleto(@Req() req: Request, @Body() createBoletoDto: CreateBoletoDto) {
    const userId = (req.user as any).userId;
    return this.condominioService.createBoleto(userId, createBoletoDto);
  }

  @Get('boletos')
  @ApiOperation({ summary: 'Listar todos os boletos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de boletos.',
    type: [BoletoResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'unidadeId', required: false, type: String })
  findAllBoletos(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('unidadeId') unidadeId?: string,
  ) {
    const userId = (req.user as any).userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;
    
    return this.condominioService.findAllBoletos(
      userId,
      pageNumber,
      limit,
      mesNumber,
      anoNumber,
      unidadeId,
    );
  }

  @Get('boletos/:id')
  @ApiOperation({ summary: 'Buscar boleto por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boleto encontrado.',
    type: BoletoResponseDto,
  })
  findOneBoleto(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.findOneBoleto(userId, id);
  }

  @Patch('boletos/:id')
  @ApiOperation({ summary: 'Atualizar boleto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boleto atualizado com sucesso.',
    type: BoletoResponseDto,
  })
  updateBoleto(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateBoletoDto: UpdateBoletoDto,
  ) {
    const userId = (req.user as any).userId;
    return this.condominioService.updateBoleto(userId, id, updateBoletoDto);
  }

  @Delete('boletos/:id')
  @ApiOperation({ summary: 'Excluir boleto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boleto excluído com sucesso.',
  })
  removeBoleto(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.removeBoleto(userId, id);
  }

  // ========== REUNIÕES ==========
  @Post('reunioes')
  @ApiOperation({ summary: 'Criar uma nova reunião' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reunião criada com sucesso.',
    type: ReuniaoResponseDto,
  })
  createReuniao(@Req() req: Request, @Body() createReuniaoDto: CreateReuniaoDto) {
    const userId = (req.user as any).userId;
    return this.condominioService.createReuniao(userId, createReuniaoDto);
  }

  @Get('reunioes')
  @ApiOperation({ summary: 'Listar todas as reuniões' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de reuniões.',
    type: [ReuniaoResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  findAllReunioes(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
  ) {
    const userId = (req.user as any).userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    
    return this.condominioService.findAllReunioes(userId, pageNumber, limit);
  }

  @Get('reunioes/:id')
  @ApiOperation({ summary: 'Buscar reunião por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reunião encontrada.',
    type: ReuniaoResponseDto,
  })
  findOneReuniao(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.findOneReuniao(userId, id);
  }

  @Patch('reunioes/:id')
  @ApiOperation({ summary: 'Atualizar reunião' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reunião atualizada com sucesso.',
    type: ReuniaoResponseDto,
  })
  updateReuniao(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReuniaoDto: UpdateReuniaoDto,
  ) {
    const userId = (req.user as any).userId;
    return this.condominioService.updateReuniao(userId, id, updateReuniaoDto);
  }

  @Delete('reunioes/:id')
  @ApiOperation({ summary: 'Excluir reunião' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reunião excluída com sucesso.',
  })
  removeReuniao(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.removeReuniao(userId, id);
  }

  // ========== AVISOS ==========
  @Post('avisos')
  @ApiOperation({ summary: 'Criar um novo aviso' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Aviso criado com sucesso.',
    type: AvisoResponseDto,
  })
  createAviso(@Req() req: Request, @Body() createAvisoDto: CreateAvisoDto) {
    const userId = (req.user as any).userId;
    return this.condominioService.createAviso(userId, createAvisoDto);
  }

  @Get('avisos')
  @ApiOperation({ summary: 'Listar todos os avisos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de avisos.',
    type: [AvisoResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  findAllAvisos(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
  ) {
    const userId = (req.user as any).userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    
    return this.condominioService.findAllAvisos(userId, pageNumber, limit);
  }

  @Get('avisos/:id')
  @ApiOperation({ summary: 'Buscar aviso por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso encontrado.',
    type: AvisoResponseDto,
  })
  findOneAviso(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.findOneAviso(userId, id);
  }

  @Patch('avisos/:id')
  @ApiOperation({ summary: 'Atualizar aviso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso atualizado com sucesso.',
    type: AvisoResponseDto,
  })
  updateAviso(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAvisoDto: UpdateAvisoDto,
  ) {
    const userId = (req.user as any).userId;
    return this.condominioService.updateAviso(userId, id, updateAvisoDto);
  }

  @Delete('avisos/:id')
  @ApiOperation({ summary: 'Excluir aviso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso excluído com sucesso.',
  })
  removeAviso(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.removeAviso(userId, id);
  }

  @Get('avisos/nao-lidos/count')
  @ApiOperation({ summary: 'Contar avisos não lidos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contador de avisos não lidos.',
  })
  countAvisosNaoLidos(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.condominioService.countAvisosNaoLidos(userId);
  }

  @Post('avisos/:id/marcar-lido')
  @ApiOperation({ summary: 'Marcar aviso como lido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso marcado como lido.',
  })
  marcarAvisoComoLido(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.marcarAvisoComoLido(userId, id);
  }

  // ========== MORADORES ==========
  @Post('moradores')
  @ApiOperation({ summary: 'Criar um novo morador' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Morador criado com sucesso.',
    type: MoradorResponseDto,
  })
  createMorador(@Req() req: Request, @Body() createMoradorDto: CreateMoradorDto) {
    const userId = (req.user as any).userId;
    return this.condominioService.createMorador(userId, createMoradorDto);
  }

  @Get('moradores')
  @ApiOperation({ summary: 'Listar todos os moradores do condomínio' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de moradores.',
    type: [MoradorResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAllMoradores(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('search') search?: string,
  ) {
    const userId = (req.user as any).userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';
    
    return this.condominioService.findAllMoradores(userId, pageNumber, limit, searchTerm);
  }

  @Get('moradores/:id')
  @ApiOperation({ summary: 'Buscar morador por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Morador encontrado.',
    type: MoradorResponseDto,
  })
  findOneMorador(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.findOneMorador(userId, id);
  }

  @Patch('moradores/:id')
  @ApiOperation({ summary: 'Atualizar morador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Morador atualizado com sucesso.',
    type: MoradorResponseDto,
  })
  updateMorador(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateMoradorDto: UpdateMoradorDto,
  ) {
    const userId = (req.user as any).userId;
    return this.condominioService.updateMorador(userId, id, updateMoradorDto);
  }

  @Delete('moradores/:id')
  @ApiOperation({ summary: 'Excluir morador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Morador excluído com sucesso.',
  })
  removeMorador(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.condominioService.removeMorador(userId, id);
  }

  // ========== BALANCETE ==========
  @Get('balancete')
  @ApiOperation({ summary: 'Obter balancete financeiro' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Balancete calculado com sucesso.',
    type: BalanceteResponseDto,
  })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  getBalancete(
    @Req() req: Request,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
  ) {
    const userId = (req.user as any).userId;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;
    
    return this.condominioService.getBalancete(userId, mesNumber, anoNumber);
  }
}
