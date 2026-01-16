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
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type { Request } from 'express';
import type { AuthUser } from '../auth/types/auth-user.interface';
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
import { BalanceteResponseDto } from './dto/balancete.dto';
import {
  CreateBalanceteMovimentacaoDto,
  UpdateBalanceteMovimentacaoDto,
  BalanceteMovimentacaoResponseDto,
} from './dto/balancete-movimentacao.dto';
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
  createUnidade(
    @Req() req: Request,
    @Body() createUnidadeDto: CreateUnidadeDto,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.createUnidade(
      userId,
      createUnidadeDto,
      empresaId,
    );
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';

    return this.condominioService.findAllUnidades(
      userId,
      pageNumber,
      limit,
      searchTerm,
      empresaId,
    );
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
    const user = req.user as AuthUser;
    const userId = user.userId;
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.updateUnidade(userId, id, updateUnidadeDto);
  }

  @Delete('unidades/:id')
  @ApiOperation({ summary: 'Excluir unidade' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unidade excluída com sucesso.',
  })
  removeUnidade(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
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
  createContaPagar(
    @Req() req: Request,
    @Body() createContaPagarDto: CreateContaPagarDto,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
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
    const user = req.user as AuthUser;
    const userId = user.userId;
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
    const user = req.user as AuthUser;
    const userId = user.userId;
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.updateContaPagar(
      userId,
      id,
      updateContaPagarDto,
    );
  }

  @Delete('contas-pagar/:id')
  @ApiOperation({ summary: 'Excluir conta a pagar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conta a pagar excluída com sucesso.',
  })
  removeContaPagar(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.removeContaPagar(userId, id);
  }

  // ========== BOLETOS ==========
  @Post('boletos')
  @UseInterceptors(FileInterceptor('arquivo'))
  @ApiOperation({ summary: 'Criar um novo boleto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Boleto criado com sucesso.',
    type: BoletoResponseDto,
  })
  createBoleto(
    @Req() req: Request,
    @Body() createBoletoDto: CreateBoletoDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    createBoletoDto.arquivo = arquivo;
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
  @ApiQuery({ name: 'unidadeId', required: false, type: String })
  findAllBoletos(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('unidadeId') unidadeId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;

    return this.condominioService.findAllBoletos(
      userId,
      pageNumber,
      limit,
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.findOneBoleto(userId, id);
  }

  @Patch('boletos/:id')
  @UseInterceptors(FileInterceptor('arquivo'))
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
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    updateBoletoDto.arquivo = arquivo;
    return this.condominioService.updateBoleto(userId, id, updateBoletoDto);
  }

  @Get('boletos/:id/download')
  @ApiOperation({ summary: 'Download do PDF do boleto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PDF do boleto.',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async downloadBoletoPdf(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const filePath = await this.condominioService.getBoletoPdfPath(userId, id);

    if (!filePath) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Arquivo PDF não encontrado',
      });
    }

    return res.sendFile(filePath, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=boleto-${id}.pdf`,
      },
    });
  }

  @Delete('boletos/:id')
  @ApiOperation({ summary: 'Excluir boleto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boleto excluído com sucesso.',
  })
  removeBoleto(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
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
  createReuniao(
    @Req() req: Request,
    @Body() createReuniaoDto: CreateReuniaoDto,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.createReuniao(
      userId,
      createReuniaoDto,
      empresaId,
    );
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;

    return this.condominioService.findAllReunioes(
      userId,
      pageNumber,
      limit,
      empresaId,
    );
  }

  @Get('reunioes/:id')
  @ApiOperation({ summary: 'Buscar reunião por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reunião encontrada.',
    type: ReuniaoResponseDto,
  })
  findOneReuniao(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.findOneReuniao(userId, id, empresaId);
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    // findOneReuniao será chamado dentro de updateReuniao e validará empresaId
    return this.condominioService.updateReuniao(
      userId,
      id,
      updateReuniaoDto,
      empresaId,
    );
  }

  @Delete('reunioes/:id')
  @ApiOperation({ summary: 'Excluir reunião' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reunião excluída com sucesso.',
  })
  removeReuniao(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    // findOneReuniao será chamado dentro de removeReuniao e validará empresaId
    return this.condominioService.removeReuniao(userId, id, empresaId);
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.createAviso(
      userId,
      createAvisoDto,
      empresaId,
    );
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;

    return this.condominioService.findAllAvisos(
      userId,
      pageNumber,
      limit,
      empresaId,
    );
  }

  @Get('avisos/:id')
  @ApiOperation({ summary: 'Buscar aviso por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso encontrado.',
    type: AvisoResponseDto,
  })
  findOneAviso(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.findOneAviso(userId, id, empresaId);
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.updateAviso(userId, id, updateAvisoDto);
  }

  @Delete('avisos/:id')
  @ApiOperation({ summary: 'Excluir aviso' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso excluído com sucesso.',
  })
  removeAviso(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    // findOneAviso será chamado dentro de removeAviso e validará empresaId
    return this.condominioService.removeAviso(userId, id, empresaId);
  }

  @Get('avisos/nao-lidos/count')
  @ApiOperation({ summary: 'Contar avisos não lidos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contador de avisos não lidos.',
  })
  countAvisosNaoLidos(@Req() req: Request) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.countAvisosNaoLidos(userId);
  }

  @Post('avisos/:id/marcar-lido')
  @ApiOperation({ summary: 'Marcar aviso como lido' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aviso marcado como lido.',
  })
  marcarAvisoComoLido(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
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
  createMorador(
    @Req() req: Request,
    @Body() createMoradorDto: CreateMoradorDto,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';

    return this.condominioService.findAllMoradores(
      userId,
      pageNumber,
      limit,
      searchTerm,
    );
  }

  @Get('moradores/:id')
  @ApiOperation({ summary: 'Buscar morador por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Morador encontrado.',
    type: MoradorResponseDto,
  })
  findOneMorador(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.updateMorador(userId, id, updateMoradorDto);
  }

  @Delete('moradores/:id')
  @ApiOperation({ summary: 'Excluir morador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Morador excluído com sucesso.',
  })
  removeMorador(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.removeMorador(userId, id);
  }

  // ========== BALANCETE MOVIMENTACAO ==========
  @Post('balancete/movimentacoes')
  @ApiOperation({ summary: 'Criar uma nova movimentação do balancete' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movimentação criada com sucesso.',
    type: BalanceteMovimentacaoResponseDto,
  })
  createBalanceteMovimentacao(
    @Req() req: Request,
    @Body() createBalanceteMovimentacaoDto: CreateBalanceteMovimentacaoDto,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.createBalanceteMovimentacao(
      userId,
      createBalanceteMovimentacaoDto,
      empresaId,
    );
  }

  @Get('balancete/movimentacoes/mensal')
  @ApiOperation({ summary: 'Obter dados agregados mensais de movimentações' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados agregados mensais retornados com sucesso.',
  })
  @ApiQuery({ name: 'ano', required: true, type: Number, description: 'Ano para filtrar' })
  @ApiQuery({ name: 'tipo', required: false, type: String, description: 'Tipo: Entrada ou Saída' })
  @ApiQuery({ name: 'condominioId', required: false, type: String, description: 'ID do condomínio' })
  getBalanceteMovimentacoesMensal(
    @Req() req: Request,
    @Query('ano') ano: string,
    @Query('tipo') tipo?: 'Entrada' | 'Saída',
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    const isSuperAdmin = user.isSuperAdmin || false;
    const anoNumber = parseInt(ano, 10);

    if (isNaN(anoNumber)) {
      throw new BadRequestException('Ano inválido');
    }

    return this.condominioService.getBalanceteMovimentacoesMensal(
      userId,
      anoNumber,
      tipo,
      condominioId,
      empresaId,
      isSuperAdmin,
    );
  }

  @Get('balancete/movimentacoes')
  @ApiOperation({ summary: 'Listar todas as movimentações do balancete' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de movimentações.',
    type: [BalanceteMovimentacaoResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number })
  @ApiQuery({ name: 'tipo', required: false, type: String })
  findAllBalanceteMovimentacoes(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('tipo') tipo?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;

    return this.condominioService.findAllBalanceteMovimentacoes(
      userId,
      pageNumber,
      limit,
      tipo,
      empresaId,
    );
  }

  @Get('balancete/movimentacoes/:id')
  @ApiOperation({ summary: 'Buscar movimentação por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movimentação encontrada.',
    type: BalanceteMovimentacaoResponseDto,
  })
  findOneBalanceteMovimentacao(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.findOneBalanceteMovimentacao(
      userId,
      id,
      empresaId,
    );
  }

  @Patch('balancete/movimentacoes/:id')
  @ApiOperation({ summary: 'Atualizar movimentação' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movimentação atualizada com sucesso.',
    type: BalanceteMovimentacaoResponseDto,
  })
  updateBalanceteMovimentacao(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateBalanceteMovimentacaoDto: UpdateBalanceteMovimentacaoDto,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    // findOneBalanceteMovimentacao será chamado dentro de updateBalanceteMovimentacao e validará empresaId
    return this.condominioService.updateBalanceteMovimentacao(
      userId,
      id,
      updateBalanceteMovimentacaoDto,
      empresaId,
    );
  }

  @Delete('balancete/movimentacoes/:id')
  @ApiOperation({ summary: 'Excluir movimentação' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movimentação excluída com sucesso.',
  })
  removeBalanceteMovimentacao(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    // findOneBalanceteMovimentacao será chamado dentro de removeBalanceteMovimentacao e validará empresaId
    return this.condominioService.removeBalanceteMovimentacao(
      userId,
      id,
      empresaId,
    );
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
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;

    return this.condominioService.getBalancete(
      userId,
      mesNumber,
      anoNumber,
      empresaId,
    );
  }
}
