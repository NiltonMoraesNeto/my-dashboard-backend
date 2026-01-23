import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ResetPasswordEmail from './templates/reset-password-email';

@Injectable()
export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        '⚠️  RESEND_API_KEY não configurada. Emails não serão enviados.',
      );
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendResetPasswordEmail(
    email: string,
    resetCode: string,
    userName?: string,
  ) {
    if (!this.resend) {
      console.warn('⚠️  Resend não configurado. Email não enviado.');
      console.log('🔑 ===== TOKEN DE RESET DE SENHA =====');
      console.log(`📧 Email: ${email}`);
      console.log(`🔢 Token: ${resetCode}`);
      console.log('=====================================');
      return;
    }

    try {
      const emailHtml = await render(
        ResetPasswordEmail({
          resetCode,
          userName: userName || 'Usuário',
        }),
      );

      const fromEmail =
        process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const fromName = process.env.RESEND_FROM_NAME || 'Sistema de Gestão';

      const { data, error } = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: '🔐 Código de Recuperação de Senha',
        html: emailHtml,
      });

      if (error) {
        console.error('❌ Erro ao enviar email:', error);
        throw new Error(`Erro ao enviar email: ${JSON.stringify(error)}`);
      }

      console.log('✅ Email de reset de senha enviado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao enviar email de reset de senha:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro desconhecido ao enviar email de reset de senha');
    }
  }
}
