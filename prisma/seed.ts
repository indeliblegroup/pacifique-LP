import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pacifique.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists:', adminEmail);
    return;
  }

  // Create admin user
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash,
    },
  });

  console.log('Created admin user:', {
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  // Create sample email templates
  const templates = [
    {
      name: 'Carta Convite - Padrão',
      subject: 'Convite para Mediação - Processo {{caseNumber}}',
      bodyHtml: `<p>Prezado(a) {{partyName}},</p><p>A <strong>PACIFIQUE!</strong> - Câmara Privada de Conciliação e Mediação convida Vossa Senhoria para participar de um procedimento de mediação referente ao processo <strong>{{caseNumber}}</strong>.</p><p><strong>Título:</strong> {{caseTitle}}</p><p>A mediação é um método voluntário e confidencial de resolução de conflitos, conduzido por um terceiro imparcial (mediador), que tem como objetivo facilitar o diálogo entre as partes para que cheguem a um acordo mutuamente satisfatório.</p><h3>Próximos Passos:</h3><ul><li>Prazo de resposta: <strong>30 (trinta) dias</strong> a contar do recebimento desta carta</li><li>Para aceitar o convite, entre em contato através do e-mail: contato@pacifique.com.br</li><li>Para mais informações, acesse: www.pacifique.com.br</li></ul><p>Ficamos à disposição para esclarecimentos adicionais.</p><p>Atenciosamente,<br><strong>PACIFIQUE!</strong><br>Câmara Privada de Conciliação e Mediação<br>CNPJ: 65.218.388/0001-47</p>`,
      bodyText: `Prezado(a) {{partyName}},\n\nA PACIFIQUE! - Câmara Privada de Conciliação e Mediação convida Vossa Senhoria para participar de um procedimento de mediação referente ao processo {{caseNumber}}.\n\nTítulo: {{caseTitle}}\n\nA mediação é um método voluntário e confidencial de resolução de conflitos, conduzido por um terceiro imparcial (mediador), que tem como objetivo facilitar o diálogo entre as partes para que cheguem a um acordo mutuamente satisfatório.\n\nPróximos Passos:\n- Prazo de resposta: 30 (trinta) dias a contar do recebimento desta carta\n- Para aceitar o convite, entre em contato através do e-mail: contato@pacifique.com.br\n- Para mais informações, acesse: www.pacifique.com.br\n\nFicamos à disposição para esclarecimentos adicionais.\n\nAtenciosamente,\nPACIFIQUE!\nCâmara Privada de Conciliação e Mediação\nCNPJ: 65.218.388/0001-47`,
      description: 'Template padrão para envio de Carta Convite às partes requeridas.',
      variablesJson: JSON.stringify(['partyName', 'caseNumber', 'caseTitle']),
    },
    {
      name: 'Notificação - Sessão Agendada',
      subject: 'Sessão de Mediação Agendada - {{caseNumber}}',
      bodyHtml: `<p>Prezado(a) {{partyName}},</p><p>Informamos que foi agendada uma sessão de mediação para o processo <strong>{{caseNumber}}</strong>.</p><p><strong>Detalhes da Sessão:</strong></p><ul><li>Data e Horário: {{sessionDate}}</li><li>Duração estimada: {{sessionDuration}} minutos</li><li>Local/Link: {{sessionLocation}}</li><li>Mediador(a): {{mediatorName}}</li></ul><p>Solicitamos sua presença pontual. Em caso de impossibilidade de comparecimento, favor comunicar com antecedência mínima de 24 horas.</p><p>Atenciosamente,<br><strong>PACIFIQUE!</strong></p>`,
      bodyText: `Prezado(a) {{partyName}},\n\nInformamos que foi agendada uma sessão de mediação para o processo {{caseNumber}}.\n\nDetalhes da Sessão:\n- Data e Horário: {{sessionDate}}\n- Duração estimada: {{sessionDuration}} minutos\n- Local/Link: {{sessionLocation}}\n- Mediador(a): {{mediatorName}}\n\nSolicitamos sua presença pontual. Em caso de impossibilidade de comparecimento, favor comunicar com antecedência mínima de 24 horas.\n\nAtenciosamente,\nPACIFIQUE!`,
      description: 'Notificação de agendamento de sessão de mediação.',
      variablesJson: JSON.stringify(['partyName', 'caseNumber', 'sessionDate', 'sessionDuration', 'sessionLocation', 'mediatorName']),
    },
  ];

  for (const template of templates) {
    const created = await prisma.emailTemplate.create({
      data: template,
    });
    console.log('Created email template:', created.name);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
