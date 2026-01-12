import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    // Validar CNPJ único se fornecido
    if (createEmpresaDto.cnpj) {
      const empresaExistente = await this.prisma.empresa.findUnique({
        where: { cnpj: createEmpresaDto.cnpj },
      });

      if (empresaExistente) {
        throw new BadRequestException('CNPJ já cadastrado');
      }
    }

    return this.prisma.empresa.create({
      data: {
        nome: createEmpresaDto.nome,
        cnpj: createEmpresaDto.cnpj,
        email: createEmpresaDto.email,
        telefone: createEmpresaDto.telefone,
        ativa: createEmpresaDto.ativa ?? true,
        dataInicio: createEmpresaDto.dataInicio ? new Date(createEmpresaDto.dataInicio) : new Date(),
        dataFim: createEmpresaDto.dataFim ? new Date(createEmpresaDto.dataFim) : null,
        observacoes: createEmpresaDto.observacoes,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;

    // Buscar todas as empresas
    let allEmpresas = await this.prisma.empresa.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Aplicar filtro de busca (por nome, email ou CNPJ)
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      allEmpresas = allEmpresas.filter(
        (empresa) =>
          empresa.nome.toLowerCase().includes(searchLower) ||
          empresa.email?.toLowerCase().includes(searchLower) ||
          empresa.cnpj?.toLowerCase().includes(searchLower),
      );
    }

    const total = allEmpresas.length;
    const data = allEmpresas.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return empresa;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    // Validar CNPJ único se fornecido e diferente do atual
    if (updateEmpresaDto.cnpj && updateEmpresaDto.cnpj !== empresa.cnpj) {
      const empresaExistente = await this.prisma.empresa.findUnique({
        where: { cnpj: updateEmpresaDto.cnpj },
      });

      if (empresaExistente) {
        throw new BadRequestException('CNPJ já cadastrado');
      }
    }

    return this.prisma.empresa.update({
      where: { id },
      data: {
        nome: updateEmpresaDto.nome,
        cnpj: updateEmpresaDto.cnpj,
        email: updateEmpresaDto.email,
        telefone: updateEmpresaDto.telefone,
        ativa: updateEmpresaDto.ativa,
        dataInicio: updateEmpresaDto.dataInicio ? new Date(updateEmpresaDto.dataInicio) : undefined,
        dataFim: updateEmpresaDto.dataFim ? new Date(updateEmpresaDto.dataFim) : updateEmpresaDto.dataFim === null ? null : undefined,
        observacoes: updateEmpresaDto.observacoes,
      },
    });
  }

  async remove(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    // Verificar se há usuários vinculados
    const usuariosCount = await this.prisma.user.count({
      where: { empresaId: id },
    });

    if (usuariosCount > 0) {
      throw new BadRequestException(
        `Não é possível excluir a empresa. Existem ${usuariosCount} usuário(s) vinculado(s) a ela.`,
      );
    }

    return this.prisma.empresa.delete({ where: { id } });
  }

  async toggleAtiva(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return this.prisma.empresa.update({
      where: { id },
      data: { ativa: !empresa.ativa },
    });
  }
}
