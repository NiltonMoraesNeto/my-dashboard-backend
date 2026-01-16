import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty({ description: 'Nome da empresa' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'CNPJ da empresa', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ description: 'Razão Social', required: false })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiProperty({ description: 'Nome Fantasia', required: false })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiProperty({ description: 'Situação Cadastral', required: false })
  @IsOptional()
  @IsString()
  situacaoCadastral?: string;

  @ApiProperty({ description: 'Data Situação Cadastral', required: false })
  @IsOptional()
  @IsDateString()
  dataSituacaoCadastral?: Date;

  @ApiProperty({ description: 'Matriz/Filial', required: false })
  @IsOptional()
  @IsString()
  matrizFilial?: string;

  @ApiProperty({ description: 'Data Início Atividade', required: false })
  @IsOptional()
  @IsDateString()
  dataInicioAtividade?: Date;

  @ApiProperty({ description: 'CNAE Principal', required: false })
  @IsOptional()
  @IsString()
  cnaePrincipal?: string;

  @ApiProperty({ description: 'CNAEs Secundários (JSON)', required: false })
  @IsOptional()
  @IsString()
  cnaesSecundarios?: string;

  @ApiProperty({ description: 'Natureza Jurídica', required: false })
  @IsOptional()
  @IsString()
  naturezaJuridica?: string;

  @ApiProperty({ description: 'Logradouro', required: false })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiProperty({ description: 'Número', required: false })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty({ description: 'Complemento', required: false })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ description: 'Bairro', required: false })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiProperty({ description: 'CEP', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'UF', required: false })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiProperty({ description: 'Município', required: false })
  @IsOptional()
  @IsString()
  municipio?: string;

  @ApiProperty({ description: 'Email de contato', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Telefones (JSON)', required: false })
  @IsOptional()
  @IsString()
  telefones?: string;

  @ApiProperty({ description: 'Capital Social', required: false })
  @IsOptional()
  @IsString()
  capitalSocial?: string;

  @ApiProperty({ description: 'Porte da Empresa', required: false })
  @IsOptional()
  @IsString()
  porteEmpresa?: string;

  @ApiProperty({ description: 'Opção Simples', required: false })
  @IsOptional()
  @IsString()
  opcaoSimples?: string;

  @ApiProperty({ description: 'Data Opção Simples', required: false })
  @IsOptional()
  @IsDateString()
  dataOpcaoSimples?: Date;

  @ApiProperty({ description: 'Opção MEI', required: false })
  @IsOptional()
  @IsString()
  opcaoMei?: string;

  @ApiProperty({ description: 'Data Opção MEI', required: false })
  @IsOptional()
  @IsDateString()
  dataOpcaoMei?: Date;

  @ApiProperty({ description: 'QSA - Quadro Societário (JSON)', required: false })
  @IsOptional()
  @IsString()
  qsa?: string;

  @ApiProperty({ description: 'Licença ativa', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @ApiProperty({ description: 'Data de início da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataInicio?: Date;

  @ApiProperty({ description: 'Data de fim da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: Date;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class UpdateEmpresaDto {
  @ApiProperty({ description: 'Nome da empresa', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'CNPJ da empresa', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ description: 'Razão Social', required: false })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiProperty({ description: 'Nome Fantasia', required: false })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiProperty({ description: 'Situação Cadastral', required: false })
  @IsOptional()
  @IsString()
  situacaoCadastral?: string;

  @ApiProperty({ description: 'Data Situação Cadastral', required: false })
  @IsOptional()
  @IsDateString()
  dataSituacaoCadastral?: Date;

  @ApiProperty({ description: 'Matriz/Filial', required: false })
  @IsOptional()
  @IsString()
  matrizFilial?: string;

  @ApiProperty({ description: 'Data Início Atividade', required: false })
  @IsOptional()
  @IsDateString()
  dataInicioAtividade?: Date;

  @ApiProperty({ description: 'CNAE Principal', required: false })
  @IsOptional()
  @IsString()
  cnaePrincipal?: string;

  @ApiProperty({ description: 'CNAEs Secundários (JSON)', required: false })
  @IsOptional()
  @IsString()
  cnaesSecundarios?: string;

  @ApiProperty({ description: 'Natureza Jurídica', required: false })
  @IsOptional()
  @IsString()
  naturezaJuridica?: string;

  @ApiProperty({ description: 'Logradouro', required: false })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiProperty({ description: 'Número', required: false })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty({ description: 'Complemento', required: false })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ description: 'Bairro', required: false })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiProperty({ description: 'CEP', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'UF', required: false })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiProperty({ description: 'Município', required: false })
  @IsOptional()
  @IsString()
  municipio?: string;

  @ApiProperty({ description: 'Email de contato', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Telefones (JSON)', required: false })
  @IsOptional()
  @IsString()
  telefones?: string;

  @ApiProperty({ description: 'Capital Social', required: false })
  @IsOptional()
  @IsString()
  capitalSocial?: string;

  @ApiProperty({ description: 'Porte da Empresa', required: false })
  @IsOptional()
  @IsString()
  porteEmpresa?: string;

  @ApiProperty({ description: 'Opção Simples', required: false })
  @IsOptional()
  @IsString()
  opcaoSimples?: string;

  @ApiProperty({ description: 'Data Opção Simples', required: false })
  @IsOptional()
  @IsDateString()
  dataOpcaoSimples?: Date;

  @ApiProperty({ description: 'Opção MEI', required: false })
  @IsOptional()
  @IsString()
  opcaoMei?: string;

  @ApiProperty({ description: 'Data Opção MEI', required: false })
  @IsOptional()
  @IsDateString()
  dataOpcaoMei?: Date;

  @ApiProperty({ description: 'QSA - Quadro Societário (JSON)', required: false })
  @IsOptional()
  @IsString()
  qsa?: string;

  @ApiProperty({ description: 'Licença ativa', required: false })
  @IsOptional()
  @IsBoolean()
  ativa?: boolean;

  @ApiProperty({ description: 'Data de início da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataInicio?: Date;

  @ApiProperty({ description: 'Data de fim da licença', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: Date;

  @ApiProperty({ description: 'Observações', required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class EmpresaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ required: false })
  cnpj?: string;

  @ApiProperty({ required: false })
  razaoSocial?: string;

  @ApiProperty({ required: false })
  nomeFantasia?: string;

  @ApiProperty({ required: false })
  situacaoCadastral?: string;

  @ApiProperty({ required: false })
  dataSituacaoCadastral?: Date;

  @ApiProperty({ required: false })
  matrizFilial?: string;

  @ApiProperty({ required: false })
  dataInicioAtividade?: Date;

  @ApiProperty({ required: false })
  cnaePrincipal?: string;

  @ApiProperty({ required: false })
  cnaesSecundarios?: string;

  @ApiProperty({ required: false })
  naturezaJuridica?: string;

  @ApiProperty({ required: false })
  logradouro?: string;

  @ApiProperty({ required: false })
  numero?: string;

  @ApiProperty({ required: false })
  complemento?: string;

  @ApiProperty({ required: false })
  bairro?: string;

  @ApiProperty({ required: false })
  cep?: string;

  @ApiProperty({ required: false })
  uf?: string;

  @ApiProperty({ required: false })
  municipio?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty({ required: false })
  telefones?: string;

  @ApiProperty({ required: false })
  capitalSocial?: string;

  @ApiProperty({ required: false })
  porteEmpresa?: string;

  @ApiProperty({ required: false })
  opcaoSimples?: string;

  @ApiProperty({ required: false })
  dataOpcaoSimples?: Date;

  @ApiProperty({ required: false })
  opcaoMei?: string;

  @ApiProperty({ required: false })
  dataOpcaoMei?: Date;

  @ApiProperty({ required: false })
  qsa?: string;

  @ApiProperty()
  ativa: boolean;

  @ApiProperty()
  dataInicio: Date;

  @ApiProperty({ required: false })
  dataFim?: Date;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
