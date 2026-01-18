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
import * as path from 'path';
import * as fs from 'fs';
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
  CreateEntregaDto,
  UpdateEntregaDto,
  EntregaResponseDto,
} from './dto/entrega.dto';
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
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllUnidades(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('search') search?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    const empresaId = user.empresaId || null;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';

    return this.condominioService.findAllUnidades(
      effectiveUserId,
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
  @UseInterceptors(FileInterceptor('anexo'))
  @ApiOperation({ summary: 'Criar uma nova conta a pagar' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conta a pagar criada com sucesso.',
    type: ContaPagarResponseDto,
  })
  createContaPagar(
    @Req() req: Request,
    @Body() createContaPagarDto: CreateContaPagarDto,
    @UploadedFile() anexo?: Express.Multer.File,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    return this.condominioService.createContaPagar(
      userId,
      createContaPagarDto,
      empresaId,
      anexo,
    );
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
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllContasPagar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;

    return this.condominioService.findAllContasPagar(
      effectiveUserId,
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
  @UseInterceptors(FileInterceptor('anexo'))
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
    @UploadedFile() anexo?: Express.Multer.File,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.updateContaPagar(
      userId,
      id,
      updateContaPagarDto,
      anexo,
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
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllBoletos(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('unidadeId') unidadeId?: string,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;

    return this.condominioService.findAllBoletos(
      effectiveUserId,
      pageNumber,
      limit,
      unidadeId,
      mesNumber,
      anoNumber,
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

  // ========== ENTREGAS ==========
  @Post('entregas')
  @UseInterceptors(FileInterceptor('anexo'))
  @ApiOperation({ summary: 'Criar uma nova entrega' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Entrega criada com sucesso.',
    type: EntregaResponseDto,
  })
  createEntrega(
    @Req() req: Request,
    @Body() createEntregaDto: CreateEntregaDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const empresaId = user.empresaId || null;
    createEntregaDto.anexo = arquivo;
    return this.condominioService.createEntrega(
      userId,
      createEntregaDto,
      empresaId,
    );
  }

  @Get('entregas')
  @ApiOperation({ summary: 'Listar todas as entregas' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'totalItemsByPage', required: false, type: Number, description: 'Itens por página' })
  @ApiQuery({ name: 'unidadeId', required: false, type: String, description: 'ID da unidade' })
  @ApiQuery({ name: 'condominioId', required: false, type: String, description: 'ID do condomínio' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de entregas retornada com sucesso.',
  })
  findAllEntregas(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('unidadeId') unidadeId?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const effectiveCondominioId = isSuperAdmin && condominioId ? condominioId : undefined;
    return this.condominioService.findAllEntregas(
      userId,
      pageNumber,
      limit,
      unidadeId,
      effectiveCondominioId,
    );
  }

  @Get('entregas/:id')
  @ApiOperation({ summary: 'Obter uma entrega por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entrega retornada com sucesso.',
    type: EntregaResponseDto,
  })
  findOneEntrega(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.findOneEntrega(userId, id);
  }

  @Get('entregas/:id/download')
  @ApiOperation({ summary: 'Download do anexo da entrega' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Arquivo anexo retornado com sucesso.',
  })
  async downloadEntregaAnexo(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const entrega = await this.condominioService.findOneEntrega(userId, id);

    if (!entrega.anexo) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Arquivo anexo não encontrado',
      });
    }

    const filePath = path.join(process.cwd(), entrega.anexo);
    
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Arquivo anexo não encontrado',
      });
    }

    // Extrair a extensão do caminho do arquivo (ex: uploads/entregas/1234567890-abc.jpg)
    const ext = path.extname(entrega.anexo).toLowerCase();
    
    // Determinar o Content-Type baseado na extensão do arquivo
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }

    // Usar o nome do arquivo original com a extensão correta
    const fileName = `anexo-entrega-${id}${ext}`;

    return res.sendFile(filePath, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  }

  @Patch('entregas/:id')
  @UseInterceptors(FileInterceptor('anexo'))
  @ApiOperation({ summary: 'Atualizar uma entrega' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entrega atualizada com sucesso.',
    type: EntregaResponseDto,
  })
  updateEntrega(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateEntregaDto: UpdateEntregaDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    updateEntregaDto.anexo = arquivo;
    return this.condominioService.updateEntrega(userId, id, updateEntregaDto);
  }

  @Delete('entregas/:id')
  @ApiOperation({ summary: 'Excluir entrega' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entrega excluída com sucesso.',
  })
  removeEntrega(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    return this.condominioService.removeEntrega(userId, id);
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
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllReunioes(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    const empresaId = user.empresaId || null;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;

    return this.condominioService.findAllReunioes(
      effectiveUserId,
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
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllAvisos(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    const empresaId = user.empresaId || null;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;

    return this.condominioService.findAllAvisos(
      effectiveUserId,
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
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllMoradores(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('search') search?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';

    return this.condominioService.findAllMoradores(
      effectiveUserId,
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
  @ApiQuery({
    name: 'ano',
    required: true,
    type: Number,
    description: 'Ano para filtrar',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    type: String,
    description: 'Tipo: Entrada ou Saída',
  })
  @ApiQuery({
    name: 'condominioId',
    required: false,
    type: String,
    description: 'ID do condomínio',
  })
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
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'condominioId', required: false, type: String })
  findAllBalanceteMovimentacoes(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('tipo') tipo?: string,
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('condominioId') condominioId?: string,
  ) {
    const user = req.user as AuthUser;
    const userId = user.userId;
    const isSuperAdmin = user.isSuperAdmin || false;
    const empresaId = user.empresaId || null;
    // Se for SuperAdmin e forneceu condominioId, usar esse condomínio como filtro
    const effectiveUserId =
      isSuperAdmin && condominioId ? condominioId : userId;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const mesNumber = mes ? parseInt(mes, 10) : undefined;
    const anoNumber = ano ? parseInt(ano, 10) : undefined;

    return this.condominioService.findAllBalanceteMovimentacoes(
      effectiveUserId,
      pageNumber,
      limit,
      tipo,
      empresaId,
      mesNumber,
      anoNumber,
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
