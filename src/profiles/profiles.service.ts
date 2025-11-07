import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: createProfileDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    
    // Para SQLite, precisamos buscar todos e filtrar manualmente para case-insensitive
    let allProfiles = await this.prisma.profile.findMany({
      orderBy: { id: 'asc' },
    });

    // Aplicar filtro de busca case-insensitive
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      allProfiles = allProfiles.filter((profile) =>
        profile.descricao.toLowerCase().includes(searchLower),
      );
    }

    const total = allProfiles.length;
    const data = allProfiles.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async remove(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return this.prisma.profile.delete({ where: { id } });
  }
}
