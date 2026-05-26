-- ============================================================================
-- Naveo · Schema Neon Postgres
-- Cole isso no SQL Editor da Neon (uma vez) pra criar as tabelas e seed inicial.
-- ============================================================================

-- ============================================================================
-- POSTS (blog)
-- ============================================================================
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  tag         TEXT NOT NULL,
  date        DATE NOT NULL,
  image       TEXT,
  excerpt     TEXT,
  lead        TEXT,
  body        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS posts_date_idx ON posts (date DESC);
CREATE INDEX IF NOT EXISTS posts_tag_idx ON posts (tag);

-- ============================================================================
-- CASES (portfólio)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cases (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  eyebrow     TEXT,
  setor       TEXT,
  ano         TEXT,
  live        TEXT,
  lead        TEXT,
  image       TEXT,
  tags        TEXT,
  desafio     TEXT,
  solucao     TEXT,
  resultado   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MESSAGES (form de contato)
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefone    TEXT,
  empresa     TEXT,
  interesse   TEXT,
  mensagem    TEXT NOT NULL,
  date        TIMESTAMPTZ DEFAULT NOW(),
  read        BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS messages_date_idx ON messages (date DESC);
CREATE INDEX IF NOT EXISTS messages_read_idx ON messages (read);

-- ============================================================================
-- SEED — Posts (6 artigos iniciais)
-- ============================================================================
INSERT INTO posts (id, title, tag, date, image, excerpt, lead, body) VALUES
  ('jornada-empreendedor',
   'A jornada do empreendedor: do zero à operação digital completa',
   'Empreendedorismo',
   '2025-11-21',
   'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
   'Como conduzir um negócio do conceito ao go-live em 90 dias com método aplicado em 12 empresas próprias.',
   'Quando alguém te procura com uma ideia, a tentação é entrar em modo execução...',
   'Etapa 1 — Investigação profunda, antes do contrato.\n\nA primeira hora gratuita não é venda — é diagnóstico...'),
  ('performance-em-vendas',
   'Performance em vendas: otimizando resultados com dados',
   'Performance',
   '2025-11-18',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
   'Métricas que importam pra decisão de vendas — funil, CAC, LTV — e como sistemas internos viram fonte de verdade.',
   'Time de vendas brasileiro reporta em planilha do gerente...',
   ''),
  ('mentoria-funil-de-vendas',
   'Mentoria e funil de vendas: virando estratégia em execução',
   'Vendas',
   '2025-11-15',
   'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
   'Quando o funil deixa de ser desenho e vira ferramenta operacional integrada ao CRM, WhatsApp e estoque.',
   '',
   ''),
  ('sistema-aquisicao-clientes',
   'Sistema de aquisição de clientes que escala sem terceirização',
   'Sistemas',
   '2025-11-12',
   'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
   'Como construir um motor de aquisição sob medida que cresce com o negócio sem virar dependência de fornecedor.',
   '',
   ''),
  ('marketing-orientado-dados',
   'Marketing digital orientado a dados: o método na prática',
   'Marketing',
   '2025-11-09',
   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
   'Tracking, atribuição e dashboard de decisão — sem isso, marketing é palpite caro. Como estruturar do zero.',
   '',
   ''),
  ('funil-vendas-conversoes',
   'Funil de vendas: como aumentar conversões em cada etapa',
   'Conversão',
   '2025-11-06',
   'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
   'Diagnóstico, gargalo e teste — o ciclo de melhoria contínua que vira receita previsível.',
   '',
   '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED — Cases (8 projetos iniciais)
-- ============================================================================
INSERT INTO cases (id, name, eyebrow, setor, ano, live, lead, image, tags, desafio, solucao, resultado) VALUES
  ('agrodesapego', 'Agrodesapego', 'Marketplace · IA', 'Agronegócio', '2024',
   'https://agrodesapego.com.br',
   'Marketplace de máquinas agrícolas usadas com agente de IA negociando via WhatsApp.',
   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
   'Marketplace, IA Negociadora, Agro, WhatsApp',
   'Mercado de máquinas agrícolas usadas é fragmentado, opaco e dependente de corretor humano...',
   'Construímos um marketplace vertical com cadastro guiado pra vendedor...',
   'Tempo médio de fechamento caiu de semanas pra dias...'),
  ('cruzetaclub', 'Cruzeta Club', 'Comunidade · SaaS', 'Comunidade automotiva', '2024',
   'https://cruzetaclub.com.br',
   'Plataforma de gestão pra clubes de carros — controle de associados, eventos, pagamentos recorrentes.',
   '/assets/cases/cruzetaclub.jpg',
   'Comunidade, SaaS, Eventos, Recorrência', '', '', ''),
  ('navbarber', 'Navbarber', 'SaaS Vertical', 'Beauty', '2024',
   'https://navbarber.com.br',
   'Plataforma de gestão pra barbearias modernas.',
   'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80',
   'SaaS Vertical, Marketplace, PWA', '', '', ''),
  ('pharmagenius', 'Pharma Genius', 'Em breve', 'Healthcare', '2026', '',
   'Plataforma farmacêutica em construção.',
   'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=2000&q=80',
   'Healthcare, Em construção', '', '', ''),
  ('obrasimples', 'ObraSimples', 'ERP Vertical', 'Construção', '2024',
   'https://obrasimples.com.br',
   'ERP/Micro SaaS sob medida pra pequenos empreendedores da construção civil.',
   'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80',
   'ERP, Fintech, Micro SaaS', '', '', ''),
  ('cuidarbemcard', 'Cuidar Bem Card', 'Plataforma de Saúde', 'Healthcare', '2023',
   'https://cuidarbemcard.com.br',
   'Empresa de saúde criada do zero.',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80',
   'Saúde, 0→1, Branding', '', '', ''),
  ('greenfuturehub', 'Green Future Hub', 'ESG', 'ESG', '2024',
   'https://greenfuturehub.com.br',
   'Ecossistema colaborativo de inovação sustentável.',
   'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80',
   'ESG, Hub, Sustentabilidade', '', '', ''),
  ('centrodediagnostico', 'Centro de Diagnóstico', 'Saúde', 'Healthcare', '2024',
   'https://centrodediagnostico.com.br',
   'Clínica de diagnóstico por imagem com 20+ anos de história.',
   'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=2000&q=80',
   'Saúde, IA, Multi-convênio', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED — Messages (4 mensagens de exemplo)
-- ============================================================================
INSERT INTO messages (id, nome, email, telefone, empresa, interesse, mensagem, date, read) VALUES
  ('m1', 'Carlos Mendes', 'carlos@agrofarm.com.br', '(65) 98888-1234', 'AgroFarm', 'Marketplace',
   'Tenho uma operação de comércio de máquinas e queria explorar a possibilidade de uma plataforma similar ao Agrodesapego, mas vertical pro setor.',
   '2025-11-22 10:14:00+00', false),
  ('m2', 'Ana Souza', 'ana@clinicvision.com.br', '(11) 97777-5566', 'ClinicVision', 'IA aplicada / Agentes',
   'Somos uma clínica de oftalmologia e queremos automatizar o atendimento WhatsApp de pacientes — triagem inicial e agendamento.',
   '2025-11-21 15:42:00+00', false),
  ('m3', 'Roberto Lima', 'roberto@bypme.com', '(31) 96666-9999', 'BY PME', 'Sistemas sob medida',
   'ERP atual não atende mais. Pequena rede com 4 lojas físicas + e-commerce, precisamos unificar.',
   '2025-11-20 09:28:00+00', true),
  ('m4', 'Juliana Castro', 'juliana@flowtech.io', '(48) 99999-3333', 'FlowTech', 'Performance / Vendas',
   'Time de vendas crescendo, CRM atual virou bagunça. Queria entender como vocês estruturam funil + automação.',
   '2025-11-19 14:05:00+00', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Sanity check — quantos registros temos?
-- ============================================================================
SELECT 'posts' as tabela, COUNT(*) as total FROM posts
UNION ALL
SELECT 'cases', COUNT(*) FROM cases
UNION ALL
SELECT 'messages', COUNT(*) FROM messages;
