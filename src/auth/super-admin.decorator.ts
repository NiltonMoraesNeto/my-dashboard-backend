import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { SuperAdminGuard } from './super-admin.guard';

export const IS_SUPER_ADMIN_KEY = 'isSuperAdmin';
export const SuperAdmin = () => SetMetadata(IS_SUPER_ADMIN_KEY, true);

export const UseSuperAdminGuard = () => applyDecorators(UseGuards(SuperAdminGuard));
