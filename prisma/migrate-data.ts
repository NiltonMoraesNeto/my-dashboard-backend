/**
 * Script de Migração de Dados para Multi-Tenant
 * 
 * Este script migra todos os dados existentes para a "Empresa Padrão"
 * que é criada automaticamente durante o seed.
 * 
 * IMPORTANTE: Execute este script APÓS criar a migration do Prisma
 * e ANTES de tornar os campos empresaId NOT NULL (se decidir fazer isso).
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateData() {
  console.log('🔄 Iniciando migração de dados para multi-tenant...');

  try {
    // 1. Verificar se a empresa padrão existe
    const empresaPadrao = await prisma.empresa.findUnique({
      where: { id: 'empresa-padrao-id' },
    });

    if (!empresaPadrao) {
      console.error('❌ Empresa padrão não encontrada! Execute o seed primeiro.');
      process.exit(1);
    }

    console.log('✅ Empresa padrão encontrada:', empresaPadrao.nome);

    // 2. Atualizar todos os usuários (exceto SuperAdmin) para empresa padrão
    console.log('👥 Migrando usuários...');
    const usuariosAtualizados = await prisma.user.updateMany({
      where: {
        empresaId: null,
        perfilId: { not: 99 }, // Não atualizar SuperAdmin
      },
      data: {
        empresaId: empresaPadrao.id,
      },
    });
    console.log(`   ✅ ${usuariosAtualizados.count} usuários migrados`);

    // 3. Migrar Unidades
    // Primeiro, precisamos obter os empresaId dos usuários que criaram as unidades
    console.log('🏢 Migrando unidades...');
    const unidades = await prisma.unidade.findMany({
      where: { empresaId: null },
      include: { user: true },
    });

    let unidadesMigradas = 0;
    for (const unidade of unidades) {
      const empresaId = unidade.user.empresaId || empresaPadrao.id;
      await prisma.unidade.update({
        where: { id: unidade.id },
        data: { empresaId },
      });
      unidadesMigradas++;
    }
    console.log(`   ✅ ${unidadesMigradas} unidades migradas`);

    // 4. Migrar Contas a Pagar
    console.log('💰 Migrando contas a pagar...');
    const contasPagar = await prisma.contaPagar.findMany({
      where: { empresaId: null },
      include: { user: true },
    });

    let contasMigradas = 0;
    for (const conta of contasPagar) {
      const empresaId = conta.user.empresaId || empresaPadrao.id;
      await prisma.contaPagar.update({
        where: { id: conta.id },
        data: { empresaId },
      });
      contasMigradas++;
    }
    console.log(`   ✅ ${contasMigradas} contas a pagar migradas`);

    // 5. Migrar Boletos
    console.log('📄 Migrando boletos...');
    const boletos = await prisma.boleto.findMany({
      where: { empresaId: null },
      include: { user: true },
    });

    let boletosMigrados = 0;
    for (const boleto of boletos) {
      const empresaId = boleto.user.empresaId || empresaPadrao.id;
      await prisma.boleto.update({
        where: { id: boleto.id },
        data: { empresaId },
      });
      boletosMigrados++;
    }
    console.log(`   ✅ ${boletosMigrados} boletos migrados`);

    // 6. Migrar Reuniões
    console.log('📅 Migrando reuniões...');
    const reunioes = await prisma.reuniao.findMany({
      where: { empresaId: null },
      include: { user: true },
    });

    let reunioesMigradas = 0;
    for (const reuniao of reunioes) {
      const empresaId = reuniao.user.empresaId || empresaPadrao.id;
      await prisma.reuniao.update({
        where: { id: reuniao.id },
        data: { empresaId },
      });
      reunioesMigradas++;
    }
    console.log(`   ✅ ${reunioesMigradas} reuniões migradas`);

    // 7. Migrar Avisos
    console.log('📢 Migrando avisos...');
    const avisos = await prisma.aviso.findMany({
      where: { empresaId: null },
      include: { user: true },
    });

    let avisosMigrados = 0;
    for (const aviso of avisos) {
      const empresaId = aviso.user.empresaId || empresaPadrao.id;
      await prisma.aviso.update({
        where: { id: aviso.id },
        data: { empresaId },
      });
      avisosMigrados++;
    }
    console.log(`   ✅ ${avisosMigrados} avisos migrados`);

    // 8. Migrar Movimentações do Balancete
    console.log('💵 Migrando movimentações do balancete...');
    const movimentacoes = await prisma.balanceteMovimentacao.findMany({
      where: { empresaId: null },
      include: { user: true },
    });

    let movimentacoesMigradas = 0;
    for (const movimentacao of movimentacoes) {
      const empresaId = movimentacao.user.empresaId || empresaPadrao.id;
      await prisma.balanceteMovimentacao.update({
        where: { id: movimentacao.id },
        data: { empresaId },
      });
      movimentacoesMigradas++;
    }
    console.log(`   ✅ ${movimentacoesMigradas} movimentações migradas`);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - Usuários: ${usuariosAtualizados.count}`);
    console.log(`   - Unidades: ${unidadesMigradas}`);
    console.log(`   - Contas a Pagar: ${contasMigradas}`);
    console.log(`   - Boletos: ${boletosMigrados}`);
    console.log(`   - Reuniões: ${reunioesMigradas}`);
    console.log(`   - Avisos: ${avisosMigrados}`);
    console.log(`   - Movimentações: ${movimentacoesMigradas}`);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração
migrateData()
  .then(() => {
    console.log('\n🎉 Processo finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Falha na migração:', error);
    process.exit(1);
  });
