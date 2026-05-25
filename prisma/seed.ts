import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Profiles
  console.log('📋 Seeding profiles...');
  const profiles = [
    { id: 1, descricao: 'Adminstrador' },
    { id: 3, descricao: 'RH' },
    { id: 4, descricao: 'Financeiro' },
    { id: 5, descricao: 'Compras' },
    { id: 6, descricao: 'Vendas' },
    { id: 7, descricao: 'Usuário' },
    { id: 8, descricao: 'Condomínio' },
    { id: 9, descricao: 'Morador' },
    { id: 99, descricao: 'SuperAdmin' },
  ];

  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { id: profile.id },
      update: {},
      create: profile,
    });
  }

  // Seed Empresa Padrão (para migração de dados existentes)
  console.log('🏢 Seeding empresa padrão...');
  const empresaPadrao = await prisma.empresa.upsert({
    where: { id: 'empresa-padrao-id' },
    update: {},
    create: {
      id: 'empresa-padrao-id',
      nome: 'Empresa Padrão',
      cnpj: null,
      email: 'contato@empresapadrao.com',
      telefone: null,
      ativa: true,
      observacoes: 'Empresa criada automaticamente para migração de dados existentes',
    },
  });

  // Seed SuperAdmin only when local credentials are explicitly provided.
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    if (adminPassword.length < 12) {
      throw new Error('SEED_ADMIN_PASSWORD must have at least 12 characters');
    }

    console.log('👥 Seeding SuperAdmin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        empresaId: null,
        perfilId: 99,
      },
      create: {
        nome: process.env.SEED_ADMIN_NAME || 'SuperAdmin',
        email: adminEmail,
        password: hashedPassword,
        perfilId: 99,
        cep: '80000000',
        empresaId: null,
      },
    });
  } else {
    console.log('ℹ️ Skipping SuperAdmin seed. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one.');
  }

  if (process.env.SEED_DEMO_DATA !== 'true') {
    console.log('ℹ️ Skipping demo sales data. Set SEED_DEMO_DATA=true to include sample dashboard data.');
    console.log('✅ Database seed completed successfully!');
    return;
  }

  // Seed Sales Data
  console.log('📊 Seeding sales data...');
  const salesData2024 = [
    { name: 'JAN', value: 8, year: 2024 },
    { name: 'FEV', value: 10, year: 2024 },
    { name: 'MAR', value: 12, year: 2024 },
    { name: 'ABR', value: 11, year: 2024 },
    { name: 'MAI', value: 9, year: 2024 },
    { name: 'JUN', value: 11, year: 2024 },
    { name: 'JUL', value: 12, year: 2024 },
    { name: 'AGO', value: 2, year: 2024 },
    { name: 'SET', value: 5, year: 2024 },
    { name: 'OUT', value: 42, year: 2024 },
    { name: 'NOV', value: 30, year: 2024 },
    { name: 'DEZ', value: 8, year: 2024 },
  ];

  const salesData2025 = [
    { name: 'JAN', value: 44, year: 2025 },
    { name: 'FEV', value: 5, year: 2025 },
    { name: 'MAR', value: 20, year: 2025 },
    { name: 'ABR', value: 0, year: 2025 },
    { name: 'MAI', value: 0, year: 2025 },
    { name: 'JUN', value: 0, year: 2025 },
    { name: 'JUL', value: 0, year: 2025 },
    { name: 'AGO', value: 0, year: 2025 },
    { name: 'SET', value: 0, year: 2025 },
    { name: 'OUT', value: 0, year: 2025 },
    { name: 'NOV', value: 0, year: 2025 },
    { name: 'DEZ', value: 0, year: 2025 },
  ];

  for (const data of [...salesData2024, ...salesData2025]) {
    await prisma.salesData.create({ data });
  }

  // Seed Sales Data By Building
  console.log('🏢 Seeding sales data by building...');
  const salesDataByBuilding = [
    // Edifício A
    { name: 'JAN', value: 80, buildingName: 'Edifício A' },
    { name: 'FEV', value: 10, buildingName: 'Edifício A' },
    { name: 'MAR', value: 12, buildingName: 'Edifício A' },
    { name: 'ABR', value: 11, buildingName: 'Edifício A' },
    { name: 'MAI', value: 9, buildingName: 'Edifício A' },
    { name: 'JUN', value: 11, buildingName: 'Edifício A' },
    { name: 'JUL', value: 12, buildingName: 'Edifício A' },
    { name: 'AGO', value: 2, buildingName: 'Edifício A' },
    { name: 'SET', value: 5, buildingName: 'Edifício A' },
    { name: 'OUT', value: 42, buildingName: 'Edifício A' },
    { name: 'NOV', value: 30, buildingName: 'Edifício A' },
    { name: 'DEZ', value: 8, buildingName: 'Edifício A' },

    // Edifício B
    { name: 'JAN', value: 10, buildingName: 'Edifício B' },
    { name: 'FEV', value: 1, buildingName: 'Edifício B' },
    { name: 'MAR', value: 8, buildingName: 'Edifício B' },
    { name: 'ABR', value: 110, buildingName: 'Edifício B' },
    { name: 'MAI', value: 40, buildingName: 'Edifício B' },
    { name: 'JUN', value: 22, buildingName: 'Edifício B' },
    { name: 'JUL', value: 70, buildingName: 'Edifício B' },
    { name: 'AGO', value: 22, buildingName: 'Edifício B' },
    { name: 'SET', value: 55, buildingName: 'Edifício B' },
    { name: 'OUT', value: 4, buildingName: 'Edifício B' },
    { name: 'NOV', value: 39, buildingName: 'Edifício B' },
    { name: 'DEZ', value: 80, buildingName: 'Edifício B' },

    // Edifício C
    { name: 'JAN', value: 1, buildingName: 'Edifício C' },
    { name: 'FEV', value: 1, buildingName: 'Edifício C' },
    { name: 'MAR', value: 4, buildingName: 'Edifício C' },
    { name: 'ABR', value: 2, buildingName: 'Edifício C' },
    { name: 'MAI', value: 3, buildingName: 'Edifício C' },
    { name: 'JUN', value: 2, buildingName: 'Edifício C' },
    { name: 'JUL', value: 7, buildingName: 'Edifício C' },
    { name: 'AGO', value: 2, buildingName: 'Edifício C' },
    { name: 'SET', value: 5, buildingName: 'Edifício C' },
    { name: 'OUT', value: 0, buildingName: 'Edifício C' },
    { name: 'NOV', value: 3, buildingName: 'Edifício C' },
    { name: 'DEZ', value: 0, buildingName: 'Edifício C' },
  ];

  for (const data of salesDataByBuilding) {
    await prisma.salesDataByBuilding.create({ data });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
