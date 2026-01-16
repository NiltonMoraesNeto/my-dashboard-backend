import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsInt,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'ID do perfil do usuário' })
  @IsInt()
  perfilId: number;

  @ApiProperty({ description: 'CEP do usuário', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'CPF do usuário', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ description: 'Data de nascimento do usuário', required: false })
  @IsOptional()
  dataNascimento?: Date;

  @ApiProperty({ description: 'Logradouro do usuário', required: false })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiProperty({ description: 'Número do endereço', required: false })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty({ description: 'Complemento do endereço', required: false })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ description: 'Bairro do usuário', required: false })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiProperty({ description: 'Cidade do usuário', required: false })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiProperty({ description: 'UF do usuário', required: false })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiProperty({ description: 'ID do condomínio (obrigatório quando perfil for Morador)', required: false })
  @IsOptional()
  @IsString()
  condominioId?: string;

  @ApiProperty({ description: 'ID da empresa (apenas para SuperAdmin)', required: false })
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiProperty({ description: 'Avatar do usuário', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Email do usuário', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'ID do perfil do usuário', required: false })
  @IsOptional()
  @IsInt()
  perfilId?: number;

  @ApiProperty({ description: 'CEP do usuário', required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ description: 'CPF do usuário', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ description: 'Data de nascimento do usuário', required: false })
  @IsOptional()
  dataNascimento?: Date;

  @ApiProperty({ description: 'Logradouro do usuário', required: false })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiProperty({ description: 'Número do endereço', required: false })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty({ description: 'Complemento do endereço', required: false })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({ description: 'Bairro do usuário', required: false })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiProperty({ description: 'Cidade do usuário', required: false })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiProperty({ description: 'UF do usuário', required: false })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiProperty({ description: 'ID do condomínio (obrigatório quando perfil for Morador)', required: false })
  @IsOptional()
  @IsString()
  condominioId?: string;

  @ApiProperty({ description: 'ID da empresa (apenas para SuperAdmin)', required: false })
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiProperty({ description: 'Avatar do usuário', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Senha atual do usuário' })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ description: 'Nova senha do usuário' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  perfilId: number;

  @ApiProperty({ required: false })
  cep?: string;

  @ApiProperty({ required: false })
  cpf?: string;

  @ApiProperty({ required: false })
  dataNascimento?: Date;

  @ApiProperty({ required: false })
  logradouro?: string;

  @ApiProperty({ required: false })
  numero?: string;

  @ApiProperty({ required: false })
  complemento?: string;

  @ApiProperty({ required: false })
  bairro?: string;

  @ApiProperty({ required: false })
  cidade?: string;

  @ApiProperty({ required: false })
  uf?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
