export interface AuthUser {
  userId: string;
  email: string;
  perfilId: string | number;
  empresaId?: string | null;
  isSuperAdmin?: boolean;
  user?: unknown;
}
