import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  resetCode: string;
  userName?: string;
}

const ResetPasswordEmail = ({ resetCode, userName = 'Usuário' }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Seu código de recuperação de senha é: {resetCode}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="border border-gray-200 rounded-lg my-10 mx-auto p-5 w-[600px] bg-white">
            {/* Header */}
            <Section className="mt-8 text-center">
              <Heading className="text-2xl font-bold text-gray-900 mb-2">
                🔐 Recuperação de Senha
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mt-8">
              <Text className="text-base text-gray-700 mb-4">
                Olá <strong>{userName}</strong>,
              </Text>
              <Text className="text-base text-gray-700 mb-4">
                Você solicitou a recuperação de senha. Use o código abaixo para redefinir sua senha:
              </Text>

              {/* Code Box */}
              <Section className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 my-6 text-center">
                <Text className="text-4xl font-bold text-gray-900 tracking-widest mb-2">
                  {resetCode}
                </Text>
                <Text className="text-sm text-gray-600">
                  Este código expira em 1 hora
                </Text>
              </Section>

              <Text className="text-sm text-gray-600 mb-4">
                Se você não solicitou esta recuperação de senha, ignore este email.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-xs text-gray-500">
                Este é um email automático, por favor não responda.
              </Text>
              <Text className="text-xs text-gray-500 mt-2">
                © {new Date().getFullYear()} Sistema de Gestão. Todos os direitos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
