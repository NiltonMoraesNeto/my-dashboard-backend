import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSalesDataDto,
  UpdateSalesDataDto,
  CreateSalesDataByBuildingDto,
  UpdateSalesDataByBuildingDto,
} from './dto/sales.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  // Sales Data methods
  async createSalesData(createSalesDataDto: CreateSalesDataDto) {
    return this.prisma.salesData.create({
      data: createSalesDataDto,
    });
  }

  async findAllSalesData() {
    return this.prisma.salesData.findMany({
      orderBy: [{ year: 'desc' }, { name: 'asc' }],
    });
  }

  async findSalesDataByYear(year: number) {
    return this.prisma.salesData.findMany({
      where: { year },
      orderBy: { name: 'asc' },
    });
  }

  async findOneSalesData(id: string) {
    const salesData = await this.prisma.salesData.findUnique({
      where: { id },
    });

    if (!salesData) {
      throw new NotFoundException(`Sales data with ID ${id} not found`);
    }

    return salesData;
  }

  async updateSalesData(id: string, updateSalesDataDto: UpdateSalesDataDto) {
    const salesData = await this.prisma.salesData.findUnique({ where: { id } });

    if (!salesData) {
      throw new NotFoundException(`Sales data with ID ${id} not found`);
    }

    return this.prisma.salesData.update({
      where: { id },
      data: updateSalesDataDto,
    });
  }

  async removeSalesData(id: string) {
    const salesData = await this.prisma.salesData.findUnique({ where: { id } });

    if (!salesData) {
      throw new NotFoundException(`Sales data with ID ${id} not found`);
    }

    return this.prisma.salesData.delete({ where: { id } });
  }

  // Sales Data By Building methods
  async createSalesDataByBuilding(
    createSalesDataByBuildingDto: CreateSalesDataByBuildingDto,
  ) {
    return this.prisma.salesDataByBuilding.create({
      data: createSalesDataByBuildingDto,
    });
  }

  async findAllSalesDataByBuilding() {
    return this.prisma.salesDataByBuilding.findMany({
      orderBy: [{ buildingName: 'asc' }, { name: 'asc' }],
    });
  }

  async findSalesDataByBuilding(buildingName: string) {
    return this.prisma.salesDataByBuilding.findMany({
      where: { buildingName },
      orderBy: { name: 'asc' },
    });
  }

  async findOneSalesDataByBuilding(id: string) {
    const salesData = await this.prisma.salesDataByBuilding.findUnique({
      where: { id },
    });

    if (!salesData) {
      throw new NotFoundException(
        `Sales data by building with ID ${id} not found`,
      );
    }

    return salesData;
  }

  async updateSalesDataByBuilding(
    id: string,
    updateSalesDataByBuildingDto: UpdateSalesDataByBuildingDto,
  ) {
    const salesData = await this.prisma.salesDataByBuilding.findUnique({
      where: { id },
    });

    if (!salesData) {
      throw new NotFoundException(
        `Sales data by building with ID ${id} not found`,
      );
    }

    return this.prisma.salesDataByBuilding.update({
      where: { id },
      data: updateSalesDataByBuildingDto,
    });
  }

  async removeSalesDataByBuilding(id: string) {
    const salesData = await this.prisma.salesDataByBuilding.findUnique({
      where: { id },
    });

    if (!salesData) {
      throw new NotFoundException(
        `Sales data by building with ID ${id} not found`,
      );
    }

    return this.prisma.salesDataByBuilding.delete({ where: { id } });
  }
}
