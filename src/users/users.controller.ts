import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, ChangePasswordDto } from './dto/user.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuários.',
    type: [UserResponseDto],
  })
  findAll(
    @Query('page') page?: string,
    @Query('totalItemsByPage') totalItemsByPage?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limit = totalItemsByPage ? parseInt(totalItemsByPage, 10) : 10;
    const searchTerm = search || '';
    
    return this.usersService.findAll(pageNumber, limit, searchTerm);
  }

  @Get('condominios/list')
  @ApiOperation({ summary: 'Listar todos os condomínios' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de condomínios.',
  })
  async findAllCondominios() {
    return this.usersService.findAllCondominios();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário excluído com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token de recuperação gerado.',
  })
  async forgotPassword(@Body() body: { email: string }) {
    return this.usersService.forgotPassword(body.email);
  }

  @Public()
  @Put('reset-password')
  @ApiOperation({ summary: 'Resetar senha com token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha alterada com sucesso.',
  })
  async resetPassword(
    @Body() body: { email: string; resetCode: string; newPassword: string },
  ) {
    return this.usersService.resetPassword(
      body.email,
      body.resetCode,
      body.newPassword,
    );
  }

  @Public()
  @Put('clean-resetCode')
  @ApiOperation({ summary: 'Limpar código de reset' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Código limpo com sucesso.',
  })
  async cleanResetCode(
    @Body() body: { email: string; resetCode: string },
  ) {
    return this.usersService.cleanResetCode(body.email, body.resetCode);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Alterar senha do usuário autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha alterada com sucesso.',
  })
  async changePassword(
    @Req() req,
    @Body() body: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(req.user.userId, body);
  }
}
