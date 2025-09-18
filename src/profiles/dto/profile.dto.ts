import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ description: 'Descrição do perfil' })
  @IsString()
  descricao: string;
}

export class UpdateProfileDto {
  @ApiProperty({ description: 'Descrição do perfil', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;
}

export class ProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  descricao: string;
}
