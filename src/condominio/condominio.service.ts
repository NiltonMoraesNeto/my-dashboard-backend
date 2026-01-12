import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateUnidadeDto, UpdateUnidadeDto } from './dto/unidade.dto';
import {
  CreateContaPagarDto,
  UpdateContaPagarDto,
} from './dto/conta-pagar.dto';
import {
  CreateBalanceteMovimentacaoDto,
  UpdateBalanceteMovimentacaoDto,
} from './dto/balancete-movimentacao.dto';
import { CreateBoletoDto, UpdateBoletoDto } from './dto/boleto.dto';
import { CreateReuniaoDto, UpdateReuniaoDto } from './dto/reuniao.dto';
import { CreateAvisoDto, UpdateAvisoDto } from './dto/aviso.dto';
import { CreateMoradorDto, UpdateMoradorDto } from './dto/morador.dto';

@Injectable()
export class CondominioService {
  constructor(private prisma: PrismaService) {}

  // Método auxiliar para obter empresaId do usuário
  private async getEmpresaId(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { empresaId: true, perfilId: true },
    });
    // SuperAdmin tem empresaId null (não importa o perfilId)
    return user?.empresaId || null;
  }

  // ========== UNIDADES ==========
  async createUnidade(userId: string, createUnidadeDto: CreateUnidadeDto, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    // Se tiver moradorId, verificar se o morador pertence ao condomínio
    if (createUnidadeDto.moradorId) {
      const morador = await this.prisma.user.findUnique({
        where: { id: createUnidadeDto.moradorId },
      });
      if (!morador || morador.condominioId !== userId) {
        throw new ForbiddenException(
          'Morador não encontrado ou não pertence ao seu condomínio',
        );
      }
    }

    return this.prisma.unidade.create({
      data: {
        ...createUnidadeDto,
        userId,
        empresaId: empresaId!,
      },
      include: {
        morador: true,
      },
    });
  }

  async findAllUnidades(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
    empresaId: string | null = null,
  ) {
    const skip = (page - 1) * limit;

    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const where: any = { userId };
    // Se não for SuperAdmin, filtrar por empresaId
    if (empresaId) {
      where.empresaId = empresaId;
    }

    let allUnidades = await this.prisma.unidade.findMany({
      where,
      include: {
        morador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      allUnidades = allUnidades.filter(
        (unidade) =>
          unidade.numero.toLowerCase().includes(searchLower) ||
          unidade.proprietario?.toLowerCase().includes(searchLower) ||
          unidade.bloco?.toLowerCase().includes(searchLower),
      );
    }

    const total = allUnidades.length;
    const data = allUnidades.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneUnidade(userId: string, id: string, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const unidade = await this.prisma.unidade.findUnique({
      where: { id },
      include: {
        boletos: true,
        contasPagar: true,
        morador: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
          },
        },
      },
    });

    if (!unidade) {
      throw new NotFoundException(`Unidade com ID ${id} não encontrada`);
    }

    if (unidade.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta unidade',
      );
    }

    // Verificar isolamento por empresa (exceto SuperAdmin)
    if (empresaId && unidade.empresaId !== empresaId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta unidade',
      );
    }

    return unidade;
  }

  async updateUnidade(
    userId: string,
    id: string,
    updateUnidadeDto: UpdateUnidadeDto,
  ) {
    await this.findOneUnidade(userId, id); // Valida existência e permissão

    // Se atualizar moradorId, verificar se o morador pertence ao condomínio
    if (updateUnidadeDto.moradorId) {
      const morador = await this.prisma.user.findUnique({
        where: { id: updateUnidadeDto.moradorId },
      });
      if (!morador || morador.condominioId !== userId) {
        throw new ForbiddenException(
          'Morador não encontrado ou não pertence ao seu condomínio',
        );
      }
    }

    return this.prisma.unidade.update({
      where: { id },
      data: updateUnidadeDto,
      include: {
        morador: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
          },
        },
      },
    });
  }

  async removeUnidade(userId: string, id: string) {
    await this.findOneUnidade(userId, id); // Valida existência e permissão

    return this.prisma.unidade.delete({
      where: { id },
    });
  }

  // ========== CONTAS A PAGAR ==========
  async createContaPagar(
    userId: string,
    createContaPagarDto: CreateContaPagarDto,
    empresaId: string | null = null,
  ) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    // Se tiver unidadeId, verificar se a unidade pertence ao usuário
    if (createContaPagarDto.unidadeId) {
      const unidade = await this.prisma.unidade.findUnique({
        where: { id: createContaPagarDto.unidadeId },
      });
      if (!unidade || unidade.userId !== userId) {
        throw new ForbiddenException(
          'Unidade não encontrada ou não pertence ao seu condomínio',
        );
      }
    }

    return this.prisma.contaPagar.create({
      data: {
        ...createContaPagarDto,
        vencimento: new Date(createContaPagarDto.vencimento),
        userId,
        empresaId: empresaId!,
      },
    });
  }

  async findAllContasPagar(
    userId: string,
    page: number = 1,
    limit: number = 10,
    mes?: number,
    ano?: number,
    empresaId: string | null = null,
  ) {
    const skip = (page - 1) * limit;

    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const where: {
      userId: string;
      mes?: number;
      ano?: number;
      empresaId?: string;
    } = { userId };
    if (mes !== undefined) where.mes = mes;
    if (ano !== undefined) where.ano = ano;
    // Se não for SuperAdmin, filtrar por empresaId
    if (empresaId) {
      where.empresaId = empresaId;
    }

    const [data, total] = await Promise.all([
      this.prisma.contaPagar.findMany({
        where,
        include: {
          unidade: true,
        },
        orderBy: { vencimento: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.contaPagar.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneContaPagar(userId: string, id: string, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const contaPagar = await this.prisma.contaPagar.findUnique({
      where: { id },
      include: {
        unidade: true,
      },
    });

    if (!contaPagar) {
      throw new NotFoundException(`Conta a pagar com ID ${id} não encontrada`);
    }

    if (contaPagar.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta conta a pagar',
      );
    }

    // Verificar isolamento por empresa (exceto SuperAdmin)
    if (empresaId && contaPagar.empresaId !== empresaId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta conta a pagar',
      );
    }

    return contaPagar;
  }

  async updateContaPagar(
    userId: string,
    id: string,
    updateContaPagarDto: UpdateContaPagarDto,
  ) {
    await this.findOneContaPagar(userId, id); // Valida existência e permissão

    // Se atualizar unidadeId, verificar se pertence ao usuário
    if (updateContaPagarDto.unidadeId) {
      const unidade = await this.prisma.unidade.findUnique({
        where: { id: updateContaPagarDto.unidadeId },
      });
      if (!unidade || unidade.userId !== userId) {
        throw new ForbiddenException(
          'Unidade não encontrada ou não pertence ao seu condomínio',
        );
      }
    }

    const data: {
      descricao?: string;
      valor?: number;
      vencimento?: Date;
      mes?: number;
      ano?: number;
      categoria?: string;
      status?: string;
      unidadeId?: string;
      observacoes?: string;
    } = {};

    if (updateContaPagarDto.descricao !== undefined) {
      data.descricao = updateContaPagarDto.descricao;
    }
    if (updateContaPagarDto.valor !== undefined) {
      data.valor = updateContaPagarDto.valor;
    }
    if (updateContaPagarDto.vencimento) {
      data.vencimento = new Date(updateContaPagarDto.vencimento);
    }
    if (updateContaPagarDto.mes !== undefined) {
      data.mes = updateContaPagarDto.mes;
    }
    if (updateContaPagarDto.ano !== undefined) {
      data.ano = updateContaPagarDto.ano;
    }
    if (updateContaPagarDto.categoria !== undefined) {
      data.categoria = updateContaPagarDto.categoria;
    }
    if (updateContaPagarDto.status !== undefined) {
      data.status = updateContaPagarDto.status;
    }
    if (updateContaPagarDto.unidadeId !== undefined) {
      data.unidadeId = updateContaPagarDto.unidadeId;
    }
    if (updateContaPagarDto.observacoes !== undefined) {
      data.observacoes = updateContaPagarDto.observacoes;
    }

    return this.prisma.contaPagar.update({
      where: { id },
      data,
    });
  }

  async removeContaPagar(userId: string, id: string) {
    await this.findOneContaPagar(userId, id); // Valida existência e permissão

    return this.prisma.contaPagar.delete({
      where: { id },
    });
  }

  // ========== BOLETOS ==========
  async createBoleto(userId: string, createBoletoDto: CreateBoletoDto, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    // Verificar se a unidade pertence ao usuário
    const unidade = await this.prisma.unidade.findUnique({
      where: { id: createBoletoDto.unidadeId },
    });
    if (!unidade || unidade.userId !== userId) {
      throw new ForbiddenException(
        'Unidade não encontrada ou não pertence ao seu condomínio',
      );
    }

    // Processar upload do arquivo PDF
    let arquivoPdf: string | undefined;
    if (createBoletoDto.arquivo) {
      arquivoPdf = await this.saveBoletoFile(createBoletoDto.arquivo);
    }

    const data: {
      unidadeId: string;
      descricao: string;
      valor: number;
      vencimento: Date;
      arquivoPdf?: string;
      status?: string;
      dataPagamento?: Date;
      observacoes?: string;
      userId: string;
      empresaId: string;
    } = {
      unidadeId: createBoletoDto.unidadeId,
      descricao: createBoletoDto.descricao,
      valor: createBoletoDto.valor,
      vencimento: new Date(createBoletoDto.vencimento),
      userId,
      empresaId: empresaId!,
    };

    if (arquivoPdf) {
      data.arquivoPdf = arquivoPdf;
    }
    if (createBoletoDto.status !== undefined) {
      data.status = createBoletoDto.status;
    }
    if (createBoletoDto.dataPagamento) {
      data.dataPagamento = new Date(createBoletoDto.dataPagamento);
    }
    if (createBoletoDto.observacoes !== undefined) {
      data.observacoes = createBoletoDto.observacoes;
    }

    return this.prisma.boleto.create({
      data,
      include: {
        unidade: true,
      },
    });
  }

  async findAllBoletos(
    userId: string,
    page: number = 1,
    limit: number = 10,
    unidadeId?: string,
  ) {
    const skip = (page - 1) * limit;

    // Buscar o usuário para verificar o perfil
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { perfil: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const allProfiles = await this.prisma.profile.findMany();
    const perfilCondominio = allProfiles.find(
      (p) =>
        p.descricao.toLowerCase().includes('condomínio') ||
        p.descricao.toLowerCase().includes('condominio'),
    );
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    // Determinar quais boletos mostrar
    let boletosWhere: Prisma.BoletoWhereInput = {};

    if (perfilCondominio && user.perfilId === perfilCondominio.id) {
      // Se é condomínio, mostra apenas os boletos criados por ele
      boletosWhere = { userId };
    } else if (perfilMorador && user.perfilId === perfilMorador.id) {
      // Se é morador, mostra boletos das unidades onde ele é morador
      const unidadesDoMorador = await this.prisma.unidade.findMany({
        where: { moradorId: userId },
        select: { id: true },
      });
      const unidadeIds = unidadesDoMorador.map((u) => u.id);

      if (unidadeIds.length === 0) {
        // Morador não tem unidades vinculadas
        return {
          data: [],
          total: 0,
          page,
          totalPages: 0,
        };
      }

      boletosWhere = { unidadeId: { in: unidadeIds } };
    } else {
      // Fallback: mostra apenas os boletos criados por ele
      boletosWhere = { userId };
    }

    // Aplicar filtros adicionais
    if (unidadeId) {
      // Verificar se a unidade pertence ao usuário (apenas para condomínio)
      if (perfilCondominio && user.perfilId === perfilCondominio.id) {
        const unidade = await this.prisma.unidade.findUnique({
          where: { id: unidadeId },
        });
        if (!unidade || unidade.userId !== userId) {
          throw new ForbiddenException(
            'Unidade não encontrada ou não pertence ao seu condomínio',
          );
        }
      }
      boletosWhere.unidadeId = unidadeId;
    }

    const [data, total] = await Promise.all([
      this.prisma.boleto.findMany({
        where: boletosWhere,
        include: {
          unidade: true,
        },
        orderBy: { vencimento: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.boleto.count({ where: boletosWhere }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneBoleto(userId: string, id: string) {
    const boleto = await this.prisma.boleto.findUnique({
      where: { id },
      include: {
        unidade: true,
      },
    });

    if (!boleto) {
      throw new NotFoundException(`Boleto com ID ${id} não encontrado`);
    }

    // Buscar o usuário para verificar o perfil
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { perfil: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const allProfiles = await this.prisma.profile.findMany();
    const perfilCondominio = allProfiles.find(
      (p) =>
        p.descricao.toLowerCase().includes('condomínio') ||
        p.descricao.toLowerCase().includes('condominio'),
    );
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    // Verificar permissão
    let temAcesso = false;
    if (perfilCondominio && user.perfilId === perfilCondominio.id) {
      // Condomínio: só pode ver boletos criados por ele
      temAcesso = boleto.userId === userId;
    } else if (perfilMorador && user.perfilId === perfilMorador.id) {
      // Morador: só pode ver boletos das unidades onde ele é morador
      temAcesso = boleto.unidade.moradorId === userId;
    } else {
      // Fallback: apenas boletos criados por ele
      temAcesso = boleto.userId === userId;
    }

    if (!temAcesso) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este boleto',
      );
    }

    return boleto;
  }

  async updateBoleto(
    userId: string,
    id: string,
    updateBoletoDto: UpdateBoletoDto,
  ) {
    const boleto = await this.findOneBoleto(userId, id); // Valida existência e permissão

    // Se atualizar unidadeId, verificar se pertence ao usuário
    if (updateBoletoDto.unidadeId) {
      const unidade = await this.prisma.unidade.findUnique({
        where: { id: updateBoletoDto.unidadeId },
      });
      if (!unidade || unidade.userId !== userId) {
        throw new ForbiddenException(
          'Unidade não encontrada ou não pertence ao seu condomínio',
        );
      }
    }

    // Processar upload do arquivo PDF se fornecido
    if (updateBoletoDto.arquivo) {
      // Deletar arquivo antigo se existir
      if (boleto.arquivoPdf) {
        await this.deleteBoletoFile(boleto.arquivoPdf);
      }
      // Salvar novo arquivo
      updateBoletoDto.arquivoPdf = await this.saveBoletoFile(updateBoletoDto.arquivo);
    }

    const data: {
      unidadeId?: string;
      descricao?: string;
      valor?: number;
      vencimento?: Date;
      arquivoPdf?: string;
      status?: string;
      dataPagamento?: Date;
      observacoes?: string;
    } = {};

    if (updateBoletoDto.unidadeId !== undefined) {
      data.unidadeId = updateBoletoDto.unidadeId;
    }
    if (updateBoletoDto.descricao !== undefined) {
      data.descricao = updateBoletoDto.descricao;
    }
    if (updateBoletoDto.valor !== undefined) {
      data.valor = updateBoletoDto.valor;
    }
    if (updateBoletoDto.vencimento) {
      data.vencimento = new Date(updateBoletoDto.vencimento);
    }
    if (updateBoletoDto.arquivoPdf !== undefined) {
      data.arquivoPdf = updateBoletoDto.arquivoPdf;
    }
    if (updateBoletoDto.status !== undefined) {
      data.status = updateBoletoDto.status;
    }
    if (updateBoletoDto.dataPagamento) {
      data.dataPagamento = new Date(updateBoletoDto.dataPagamento);
    }
    if (updateBoletoDto.observacoes !== undefined) {
      data.observacoes = updateBoletoDto.observacoes;
    }

    return this.prisma.boleto.update({
      where: { id },
      data,
      include: {
        unidade: true,
      },
    });
  }

  async removeBoleto(userId: string, id: string) {
    const boleto = await this.findOneBoleto(userId, id); // Valida existência e permissão

    // Deletar arquivo PDF se existir
    if (boleto.arquivoPdf) {
      await this.deleteBoletoFile(boleto.arquivoPdf);
    }

    return this.prisma.boleto.delete({
      where: { id },
    });
  }

  // Métodos auxiliares para gerenciamento de arquivos
  private async saveBoletoFile(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'boletos');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Salvar arquivo
    fs.writeFileSync(filePath, file.buffer);

    // Retornar caminho relativo para armazenar no banco
    return `uploads/boletos/${fileName}`;
  }

  private async deleteBoletoFile(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async getBoletoPdfPath(userId: string, id: string): Promise<string | null> {
    const boleto = await this.findOneBoleto(userId, id);
    
    if (!boleto.arquivoPdf) {
      return null;
    }

    const fullPath = path.join(process.cwd(), boleto.arquivoPdf);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return fullPath;
  }

  // ========== REUNIÕES ==========
  async createReuniao(userId: string, createReuniaoDto: CreateReuniaoDto, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    return this.prisma.reuniao.create({
      data: {
        ...createReuniaoDto,
        data: new Date(createReuniaoDto.data),
        userId,
        empresaId: empresaId!,
      },
    });
  }

  async findAllReunioes(userId: string, page: number = 1, limit: number = 10, empresaId: string | null = null) {
    const skip = (page - 1) * limit;

    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const where: any = { userId };
    // Se não for SuperAdmin, filtrar por empresaId
    if (empresaId) {
      where.empresaId = empresaId;
    }

    const [data, total] = await Promise.all([
      this.prisma.reuniao.findMany({
        where,
        orderBy: { data: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.reuniao.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneReuniao(userId: string, id: string, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const reuniao = await this.prisma.reuniao.findUnique({
      where: { id },
    });

    if (!reuniao) {
      throw new NotFoundException(`Reunião com ID ${id} não encontrada`);
    }

    if (reuniao.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta reunião',
      );
    }

    // Validar isolamento por empresaId (se não for SuperAdmin)
    if (empresaId && reuniao.empresaId !== empresaId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta reunião',
      );
    }

    return reuniao;
  }

  async updateReuniao(
    userId: string,
    id: string,
    updateReuniaoDto: UpdateReuniaoDto,
    empresaId: string | null = null,
  ) {
    await this.findOneReuniao(userId, id, empresaId); // Valida existência e permissão

    const data: {
      titulo?: string;
      data?: Date;
      hora?: string;
      local?: string;
      tipo?: string;
      pauta?: string;
      status?: string;
    } = {};

    if (updateReuniaoDto.titulo !== undefined) {
      data.titulo = updateReuniaoDto.titulo;
    }
    if (updateReuniaoDto.data) {
      data.data = new Date(updateReuniaoDto.data);
    }
    if (updateReuniaoDto.hora !== undefined) {
      data.hora = updateReuniaoDto.hora;
    }
    if (updateReuniaoDto.local !== undefined) {
      data.local = updateReuniaoDto.local;
    }
    if (updateReuniaoDto.tipo !== undefined) {
      data.tipo = updateReuniaoDto.tipo;
    }
    if (updateReuniaoDto.pauta !== undefined) {
      data.pauta = updateReuniaoDto.pauta;
    }
    if (updateReuniaoDto.status !== undefined) {
      data.status = updateReuniaoDto.status;
    }

    return this.prisma.reuniao.update({
      where: { id },
      data,
    });
  }

  async removeReuniao(userId: string, id: string, empresaId: string | null = null) {
    await this.findOneReuniao(userId, id, empresaId); // Valida existência e permissão

    return this.prisma.reuniao.delete({
      where: { id },
    });
  }

  // ========== AVISOS ==========
  async createAviso(userId: string, createAvisoDto: CreateAvisoDto, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const data: {
      titulo: string;
      descricao: string;
      tipo?: string;
      dataInicio: Date;
      dataFim?: Date;
      destaque?: boolean;
      userId: string;
      empresaId: string;
    } = {
      titulo: createAvisoDto.titulo,
      descricao: createAvisoDto.descricao,
      dataInicio: new Date(createAvisoDto.dataInicio),
      userId,
      empresaId: empresaId!,
    };

    if (createAvisoDto.tipo !== undefined) {
      data.tipo = createAvisoDto.tipo;
    }
    if (createAvisoDto.dataFim) {
      data.dataFim = new Date(createAvisoDto.dataFim);
    }
    if (createAvisoDto.destaque !== undefined) {
      data.destaque = createAvisoDto.destaque;
    }

    return this.prisma.aviso.create({
      data,
    });
  }

  async findAllAvisos(userId: string, page: number = 1, limit: number = 10, empresaId: string | null = null) {
    const skip = (page - 1) * limit;

    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    // Buscar o usuário para verificar o perfil
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { perfil: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const allProfiles = await this.prisma.profile.findMany();
    const perfilCondominio = allProfiles.find(
      (p) =>
        p.descricao.toLowerCase().includes('condomínio') ||
        p.descricao.toLowerCase().includes('condominio'),
    );
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    // Determinar quais avisos mostrar
    let avisosWhere: Prisma.AvisoWhereInput = {};
    if (perfilCondominio && user.perfilId === perfilCondominio.id) {
      // Se é condomínio, mostra apenas os avisos criados por ele
      avisosWhere = { userId };
    } else if (
      perfilMorador &&
      user.perfilId === perfilMorador.id &&
      user.condominioId
    ) {
      // Se é morador, mostra avisos do condomínio dele
      avisosWhere = { userId: user.condominioId };
    } else {
      // Fallback: mostra apenas os avisos criados por ele
      avisosWhere = { userId };
    }

    // Adicionar filtro por empresaId (se não for SuperAdmin)
    if (empresaId) {
      avisosWhere.empresaId = empresaId;
    }

    const [avisos, total] = await Promise.all([
      this.prisma.aviso.findMany({
        where: avisosWhere,
        orderBy: [{ destaque: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.aviso.count({ where: avisosWhere }),
    ]);

    // Buscar leituras do usuário
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const leituras = (await (this.prisma as any).avisoLeitura.findMany({
      where: { userId },
      select: { avisoId: true, lido: true },
    })) as Array<{ avisoId: string; lido: boolean }>;

    const leiturasMap = new Map(leituras.map((l) => [l.avisoId, l.lido]));

    // Adicionar informação de leitura aos avisos
    const data = avisos.map((aviso) => ({
      ...aviso,
      lido: leiturasMap.get(aviso.id) ?? false,
    }));

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneAviso(userId: string, id: string, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const aviso = await this.prisma.aviso.findUnique({
      where: { id },
    });

    if (!aviso) {
      throw new NotFoundException(`Aviso com ID ${id} não encontrado`);
    }

    if (aviso.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este aviso',
      );
    }

    // Validar isolamento por empresaId (se não for SuperAdmin)
    if (empresaId && aviso.empresaId !== empresaId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este aviso',
      );
    }

    return aviso;
  }

  async updateAviso(
    userId: string,
    id: string,
    updateAvisoDto: UpdateAvisoDto,
    empresaId: string | null = null,
  ) {
    await this.findOneAviso(userId, id, empresaId); // Valida existência e permissão

    const data: {
      titulo?: string;
      descricao?: string;
      tipo?: string;
      dataInicio?: Date;
      dataFim?: Date;
      destaque?: boolean;
    } = {};

    if (updateAvisoDto.titulo !== undefined) {
      data.titulo = updateAvisoDto.titulo;
    }
    if (updateAvisoDto.descricao !== undefined) {
      data.descricao = updateAvisoDto.descricao;
    }
    if (updateAvisoDto.tipo !== undefined) {
      data.tipo = updateAvisoDto.tipo;
    }
    if (updateAvisoDto.dataInicio) {
      data.dataInicio = new Date(updateAvisoDto.dataInicio);
    }
    if (updateAvisoDto.dataFim) {
      data.dataFim = new Date(updateAvisoDto.dataFim);
    }
    if (updateAvisoDto.destaque !== undefined) {
      data.destaque = updateAvisoDto.destaque;
    }

    return this.prisma.aviso.update({
      where: { id },
      data,
    });
  }

  async removeAviso(userId: string, id: string, empresaId: string | null = null) {
    await this.findOneAviso(userId, id, empresaId); // Valida existência e permissão

    return this.prisma.aviso.delete({
      where: { id },
    });
  }

  async countAvisosNaoLidos(userId: string) {
    // Buscar o usuário para verificar o perfil
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { perfil: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const allProfiles = await this.prisma.profile.findMany();
    const perfilCondominio = allProfiles.find(
      (p) =>
        p.descricao.toLowerCase().includes('condomínio') ||
        p.descricao.toLowerCase().includes('condominio'),
    );
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    // Determinar quais avisos contar
    let avisosWhere: Prisma.AvisoWhereInput = {};
    if (perfilCondominio && user.perfilId === perfilCondominio.id) {
      // Se é condomínio, conta apenas os avisos criados por ele
      avisosWhere = { userId };
    } else if (
      perfilMorador &&
      user.perfilId === perfilMorador.id &&
      user.condominioId
    ) {
      // Se é morador, conta avisos do condomínio dele
      avisosWhere = { userId: user.condominioId };
    } else {
      // Fallback: conta apenas os avisos criados por ele
      avisosWhere = { userId };
    }

    // Buscar todos os avisos relevantes
    const avisos = await this.prisma.aviso.findMany({
      where: avisosWhere,
      select: { id: true },
    });

    const avisoIds = avisos.map((a) => a.id);

    if (avisoIds.length === 0) {
      return { count: 0 };
    }

    // Buscar avisos que foram lidos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const avisosLidos = (await (this.prisma as any).avisoLeitura.findMany({
      where: {
        userId,
        avisoId: { in: avisoIds },
        lido: true,
      },
      select: { avisoId: true },
    })) as Array<{ avisoId: string }>;

    const avisosLidosIds = new Set(avisosLidos.map((al) => al.avisoId));
    const naoLidos = avisoIds.filter((id) => !avisosLidosIds.has(id));

    return { count: naoLidos.length };
  }

  async marcarAvisoComoLido(userId: string, avisoId: string) {
    // Verificar se o aviso existe e se o usuário tem acesso
    const aviso = await this.prisma.aviso.findUnique({
      where: { id: avisoId },
    });

    if (!aviso) {
      throw new NotFoundException(`Aviso com ID ${avisoId} não encontrado`);
    }

    // Buscar o usuário para verificar o perfil
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { perfil: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const allProfiles = await this.prisma.profile.findMany();
    const perfilCondominio = allProfiles.find(
      (p) =>
        p.descricao.toLowerCase().includes('condomínio') ||
        p.descricao.toLowerCase().includes('condominio'),
    );
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    // Verificar permissão
    let temAcesso = false;
    if (perfilCondominio && user.perfilId === perfilCondominio.id) {
      temAcesso = aviso.userId === userId;
    } else if (
      perfilMorador &&
      user.perfilId === perfilMorador.id &&
      user.condominioId
    ) {
      temAcesso = aviso.userId === user.condominioId;
    } else {
      temAcesso = aviso.userId === userId;
    }

    if (!temAcesso) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este aviso',
      );
    }

    // Criar ou atualizar registro de leitura
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await (this.prisma as any).avisoLeitura.upsert({
      where: {
        userId_avisoId: {
          userId,
          avisoId,
        },
      },
      update: {
        lido: true,
      },
      create: {
        userId,
        avisoId,
        lido: true,
      },
    });

    return { success: true };
  }

  // ========== MORADORES ==========
  async createMorador(
    condominioId: string,
    createMoradorDto: CreateMoradorDto,
  ) {
    // Buscar perfil "Morador" - SQLite não suporta mode: 'insensitive', então buscamos todos e filtramos
    const allProfiles = await this.prisma.profile.findMany();
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    if (!perfilMorador) {
      throw new NotFoundException(
        'Perfil Morador não encontrado. Por favor, crie o perfil primeiro.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      createMoradorDto.password || '123456',
      10,
    );

    return this.prisma.user.create({
      data: {
        nome: createMoradorDto.nome,
        email: createMoradorDto.email,
        password: hashedPassword,
        perfilId: perfilMorador.id,
        condominioId,
        cep: createMoradorDto.cep,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        condominioId: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
    });
  }

  async findAllMoradores(
    condominioId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * limit;

    // Buscar perfil Morador - SQLite não suporta mode: 'insensitive', então buscamos todos e filtramos
    const allProfiles = await this.prisma.profile.findMany();
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    if (!perfilMorador) {
      return { data: [], total: 0, page, totalPages: 0 };
    }

    const where: {
      condominioId: string;
      perfilId: number;
    } = {
      condominioId,
      perfilId: perfilMorador.id,
    };

    let allMoradores = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        condominioId: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      allMoradores = allMoradores.filter(
        (morador) =>
          morador.nome.toLowerCase().includes(searchLower) ||
          morador.email.toLowerCase().includes(searchLower),
      );
    }

    const total = allMoradores.length;
    const data = allMoradores.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneMorador(condominioId: string, id: string) {
    // Buscar perfil Morador - SQLite não suporta mode: 'insensitive', então buscamos todos e filtramos
    const allProfiles = await this.prisma.profile.findMany();
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    if (!perfilMorador) {
      throw new NotFoundException('Perfil Morador não encontrado');
    }

    const morador = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        condominioId: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
    });

    if (!morador) {
      throw new NotFoundException(`Morador com ID ${id} não encontrado`);
    }

    if (morador.condominioId !== condominioId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este morador',
      );
    }

    return morador;
  }

  async updateMorador(
    condominioId: string,
    id: string,
    updateMoradorDto: UpdateMoradorDto,
  ) {
    await this.findOneMorador(condominioId, id); // Valida existência e permissão

    const data: {
      nome?: string;
      email?: string;
      cep?: string;
      password?: string;
      telefone?: string;
    } = {};

    if (updateMoradorDto.nome !== undefined) {
      data.nome = updateMoradorDto.nome;
    }
    if (updateMoradorDto.email !== undefined) {
      data.email = updateMoradorDto.email;
    }
    if (updateMoradorDto.cep !== undefined) {
      data.cep = updateMoradorDto.cep;
    }
    if (updateMoradorDto.telefone !== undefined) {
      data.telefone = updateMoradorDto.telefone;
    }

    // Se tiver nova senha, hash ela
    if (updateMoradorDto.password) {
      const hashedPassword = await bcrypt.hash(updateMoradorDto.password, 10);
      data.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        condominioId: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
    });
  }

  async removeMorador(condominioId: string, id: string) {
    await this.findOneMorador(condominioId, id); // Valida existência e permissão

    // Verificar se o morador está vinculado a alguma unidade
    const unidades = await this.prisma.unidade.findMany({
      where: { moradorId: id },
    });

    if (unidades.length > 0) {
      throw new BadRequestException(
        'Não é possível excluir este morador pois ele está vinculado a uma ou mais unidades',
      );
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  // ========== BALANCETE MOVIMENTACAO ==========
  async createBalanceteMovimentacao(
    userId: string,
    createBalanceteMovimentacaoDto: CreateBalanceteMovimentacaoDto,
    empresaId: string | null = null,
  ) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    return this.prisma.balanceteMovimentacao.create({
      data: {
        ...createBalanceteMovimentacaoDto,
        data: new Date(createBalanceteMovimentacaoDto.data),
        userId,
        empresaId: empresaId!,
      },
    });
  }

  async findAllBalanceteMovimentacoes(
    userId: string,
    page: number = 1,
    limit: number = 10,
    tipo?: string,
    empresaId: string | null = null,
  ) {
    const skip = (page - 1) * limit;

    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const where: any = { userId };
    if (tipo) where.tipo = tipo;
    // Se não for SuperAdmin, filtrar por empresaId
    if (empresaId) {
      where.empresaId = empresaId;
    }

    const [data, total] = await Promise.all([
      this.prisma.balanceteMovimentacao.findMany({
        where,
        orderBy: { data: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.balanceteMovimentacao.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneBalanceteMovimentacao(userId: string, id: string, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const movimentacao = await this.prisma.balanceteMovimentacao.findUnique({
      where: { id },
    });

    if (!movimentacao) {
      throw new NotFoundException(
        `Movimentação com ID ${id} não encontrada`,
      );
    }

    if (movimentacao.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta movimentação',
      );
    }

    // Validar isolamento por empresaId (se não for SuperAdmin)
    if (empresaId && movimentacao.empresaId !== empresaId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta movimentação',
      );
    }

    return movimentacao;
  }

  async updateBalanceteMovimentacao(
    userId: string,
    id: string,
    updateBalanceteMovimentacaoDto: UpdateBalanceteMovimentacaoDto,
    empresaId: string | null = null,
  ) {
    const movimentacao = await this.findOneBalanceteMovimentacao(userId, id, empresaId);

    const data: {
      tipo?: string;
      data?: Date;
      valor?: number;
      motivo?: string;
    } = {};

    if (updateBalanceteMovimentacaoDto.tipo !== undefined) {
      data.tipo = updateBalanceteMovimentacaoDto.tipo;
    }
    if (updateBalanceteMovimentacaoDto.data !== undefined) {
      data.data = new Date(updateBalanceteMovimentacaoDto.data);
    }
    if (updateBalanceteMovimentacaoDto.valor !== undefined) {
      data.valor = updateBalanceteMovimentacaoDto.valor;
    }
    if (updateBalanceteMovimentacaoDto.motivo !== undefined) {
      data.motivo = updateBalanceteMovimentacaoDto.motivo;
    }

    return this.prisma.balanceteMovimentacao.update({
      where: { id },
      data,
    });
  }

  async removeBalanceteMovimentacao(userId: string, id: string, empresaId: string | null = null) {
    await this.findOneBalanceteMovimentacao(userId, id, empresaId);

    return this.prisma.balanceteMovimentacao.delete({
      where: { id },
    });
  }

  // ========== BALANCETE ==========
  async getBalancete(userId: string, mes?: number, ano?: number, empresaId: string | null = null) {
    // Obter empresaId se não fornecido
    if (empresaId === null) {
      empresaId = await this.getEmpresaId(userId);
    }

    const whereContasPagar: any = { userId };
    if (mes !== undefined) whereContasPagar.mes = mes;
    if (ano !== undefined) whereContasPagar.ano = ano;
    // Se não for SuperAdmin, filtrar por empresaId
    if (empresaId) {
      whereContasPagar.empresaId = empresaId;
    }

    const whereBoletos: any = { userId };
    if (mes !== undefined) whereBoletos.mes = mes;
    if (ano !== undefined) whereBoletos.ano = ano;
    // Se não for SuperAdmin, filtrar por empresaId
    if (empresaId) {
      whereBoletos.empresaId = empresaId;
    }

    const contasPagar = await this.prisma.contaPagar.findMany({
      where: whereContasPagar,
    });

    const boletos = await this.prisma.boleto.findMany({
      where: whereBoletos,
      include: {
        unidade: true,
      },
    });

    const despesas = contasPagar.reduce((sum, conta) => {
      if (conta.status === 'Paga') {
        return sum + Number(conta.valor);
      }
      return sum;
    }, 0);

    const receitas = boletos.reduce((sum, boleto) => {
      if (boleto.status === 'Pago') {
        return sum + Number(boleto.valor);
      }
      return sum;
    }, 0);

    const saldo = receitas - despesas;

    return {
      mes: mes || new Date().getMonth() + 1,
      ano: ano || new Date().getFullYear(),
      receitas,
      despesas,
      saldo,
    };
  }
}
