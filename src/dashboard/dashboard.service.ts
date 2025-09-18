import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MonthlySalesData {
  name: string;
  value: number;
}

export interface ComparisonData {
  name: string;
  occupied: number;
  booked: number;
  available: number;
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMonthlySalesData(year?: number): Promise<MonthlySalesData[]> {
    const currentYear = year || new Date().getFullYear();

    // Buscar dados de vendas do ano especificado
    const salesData = await this.prisma.salesData.findMany({
      where: {
        year: currentYear,
      },
    });

    // Se não há dados no banco, retornar dados padrão por mês
    if (salesData.length === 0) {
      const monthNames = [
        'JAN',
        'FEV',
        'MAR',
        'ABR',
        'MAI',
        'JUN',
        'JUL',
        'AGO',
        'SET',
        'OUT',
        'NOV',
        'DEZ',
      ];

      return monthNames.map((name) => ({
        name,
        value: 0,
      }));
    }

    // Retornar dados do banco
    return salesData.map((data) => ({
      name: data.name,
      value: data.value,
    }));
  }

  async getComparisonData(year?: number): Promise<ComparisonData[]> {
    const currentYear = year || new Date().getFullYear();

    // Para dados de comparação, vou simular baseado nos dados de vendas
    const salesData = await this.prisma.salesData.findMany({
      where: {
        year: currentYear,
      },
    });

    const monthNames = [
      'JAN',
      'FEV',
      'MAR',
      'ABR',
      'MAI',
      'JUN',
      'JUL',
      'AGO',
      'SET',
      'OUT',
      'NOV',
      'DEZ',
    ];

    // Se não há dados, retornar dados padrão
    if (salesData.length === 0) {
      return monthNames.map((name) => ({
        name,
        occupied: 15,
        booked: 10,
        available: 25,
      }));
    }

    // Calcular dados de comparação baseados nas vendas
    return salesData.map((data) => {
      const totalValue = data.value;
      const occupied = Math.floor(totalValue * 0.6); // 60% ocupado/vendido
      const booked = Math.floor(totalValue * 0.25); // 25% reservado/negociado
      const available = Math.max(0, totalValue - occupied - booked); // resto disponível/cancelado

      return {
        name: data.name,
        occupied,
        booked,
        available,
      };
    });
  }

  // Método para popular dados de exemplo
  async seedMonthlyData(year: number): Promise<void> {
    const monthData = [
      { name: 'JAN', value: 8 },
      { name: 'FEV', value: 10 },
      { name: 'MAR', value: 12 },
      { name: 'ABR', value: 11 },
      { name: 'MAI', value: 9 },
      { name: 'JUN', value: 11 },
      { name: 'JUL', value: 12 },
      { name: 'AGO', value: 2 },
      { name: 'SET', value: 5 },
      { name: 'OUT', value: 42 },
      { name: 'NOV', value: 30 },
      { name: 'DEZ', value: 8 },
    ];

    // Deletar dados existentes do ano
    await this.prisma.salesData.deleteMany({
      where: { year },
    });

    // Inserir novos dados
    await this.prisma.salesData.createMany({
      data: monthData.map((data) => ({
        ...data,
        year,
      })),
    });
  }
}
