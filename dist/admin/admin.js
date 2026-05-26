/* ==========================================================================
   Naveo Admin — vanilla JS
   Auth + storage layer (localStorage) com mock data.
   Pronto pra trocar por Supabase ou similar — só substituir o objeto `Storage`.
   ========================================================================== */

// ============================================================
// AUTH
// ============================================================
// Credenciais demo. PRODUÇÃO: substituir por Supabase Auth.
const ADMIN_CREDS = {
  email: "admin@naveo.com.br",
  password: "naveo2026", // ATENÇÃO: hardcoded só pra demo
};

const Auth = {
  isLogged() {
    return localStorage.getItem("naveo_admin_session") === "active";
  },
  login(email, password) {
    if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
      localStorage.setItem("naveo_admin_session", "active");
      localStorage.setItem("naveo_admin_email", email);
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem("naveo_admin_session");
    localStorage.removeItem("naveo_admin_email");
    location.href = "/admin/login";
  },
  guard() {
    if (!this.isLogged()) {
      location.href = "/admin/login";
      return false;
    }
    return true;
  },
  email() {
    return localStorage.getItem("naveo_admin_email") || ADMIN_CREDS.email;
  },
};

// ============================================================
// STORAGE LAYER (localStorage)
// Pra trocar por Supabase: reescrever os métodos retornando Promises
// ============================================================
const Storage = {
  // POSTS
  posts: {
    all() {
      const raw = localStorage.getItem("naveo_posts");
      if (raw) return JSON.parse(raw);
      // seed inicial — replica os posts já no /blog
      const seed = [
        { id: "jornada-empreendedor", title: "A jornada do empreendedor: do zero à operação digital completa", tag: "Empreendedorismo", date: "2025-11-21", excerpt: "Como conduzir um negócio do conceito ao go-live em 90 dias com método aplicado em 12 empresas próprias.", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80", lead: "Quando alguém te procura com uma ideia, a tentação é entrar em modo execução...", body: "Etapa 1 — Investigação profunda, antes do contrato.\n\nA primeira hora gratuita não é venda — é diagnóstico..." },
        { id: "performance-em-vendas", title: "Performance em vendas: otimizando resultados com dados", tag: "Performance", date: "2025-11-18", excerpt: "Métricas que importam pra decisão de vendas — funil, CAC, LTV — e como sistemas internos viram fonte de verdade.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", lead: "Time de vendas brasileiro reporta em planilha do gerente...", body: "" },
        { id: "mentoria-funil-de-vendas", title: "Mentoria e funil de vendas: virando estratégia em execução", tag: "Vendas", date: "2025-11-15", excerpt: "Quando o funil deixa de ser desenho e vira ferramenta operacional integrada ao CRM, WhatsApp e estoque.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", lead: "", body: "" },
        { id: "sistema-aquisicao-clientes", title: "Sistema de aquisição de clientes que escala sem terceirização", tag: "Sistemas", date: "2025-11-12", excerpt: "Como construir um motor de aquisição sob medida que cresce com o negócio sem virar dependência de fornecedor.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80", lead: "", body: "" },
        { id: "marketing-orientado-dados", title: "Marketing digital orientado a dados: o método na prática", tag: "Marketing", date: "2025-11-09", excerpt: "Tracking, atribuição e dashboard de decisão — sem isso, marketing é palpite caro. Como estruturar do zero.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", lead: "", body: "" },
        { id: "funil-vendas-conversoes", title: "Funil de vendas: como aumentar conversões em cada etapa", tag: "Conversão", date: "2025-11-06", excerpt: "Diagnóstico, gargalo e teste — o ciclo de melhoria contínua que vira receita previsível.", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80", lead: "", body: "" },
      ];
      localStorage.setItem("naveo_posts", JSON.stringify(seed));
      return seed;
    },
    get(id) {
      return this.all().find((p) => p.id === id);
    },
    save(post) {
      const list = this.all();
      const idx = list.findIndex((p) => p.id === post.id);
      if (idx >= 0) list[idx] = post;
      else list.unshift(post);
      localStorage.setItem("naveo_posts", JSON.stringify(list));
    },
    delete(id) {
      const list = this.all().filter((p) => p.id !== id);
      localStorage.setItem("naveo_posts", JSON.stringify(list));
    },
  },

  // CASES
  cases: {
    all() {
      const raw = localStorage.getItem("naveo_cases");
      if (raw) return JSON.parse(raw);
      const seed = [
        { id: "agrodesapego", name: "Agrodesapego", eyebrow: "Marketplace · IA", setor: "Agronegócio", ano: "2024", live: "https://agrodesapego.com.br", lead: "Marketplace de máquinas agrícolas usadas com agente de IA negociando via WhatsApp.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80", tags: "Marketplace, IA Negociadora, Agro, WhatsApp", desafio: "Mercado de máquinas agrícolas usadas é fragmentado, opaco e dependente de corretor humano...", solucao: "Construímos um marketplace vertical com cadastro guiado pra vendedor...", resultado: "Tempo médio de fechamento caiu de semanas pra dias..." },
        { id: "cruzetaclub", name: "Cruzeta Club", eyebrow: "Comunidade · SaaS", setor: "Comunidade automotiva", ano: "2024", live: "https://cruzetaclub.com.br", lead: "Plataforma de gestão pra clubes de carros — controle de associados, eventos, pagamentos recorrentes.", image: "/assets/cases/cruzetaclub.jpg", tags: "Comunidade, SaaS, Eventos, Recorrência", desafio: "", solucao: "", resultado: "" },
        { id: "navbarber", name: "Navbarber", eyebrow: "SaaS Vertical", setor: "Beauty", ano: "2024", live: "https://navbarber.com.br", lead: "Plataforma de gestão pra barbearias modernas.", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80", tags: "SaaS Vertical, Marketplace, PWA", desafio: "", solucao: "", resultado: "" },
        { id: "pharmagenius", name: "Pharma Genius", eyebrow: "Em breve", setor: "Healthcare", ano: "2026", live: "", lead: "Plataforma farmacêutica em construção.", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=2000&q=80", tags: "Healthcare, Em construção", desafio: "", solucao: "", resultado: "" },
        { id: "obrasimples", name: "ObraSimples", eyebrow: "ERP Vertical", setor: "Construção", ano: "2024", live: "https://obrasimples.com.br", lead: "ERP/Micro SaaS sob medida pra pequenos empreendedores da construção civil.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80", tags: "ERP, Fintech, Micro SaaS", desafio: "", solucao: "", resultado: "" },
        { id: "cuidarbemcard", name: "Cuidar Bem Card", eyebrow: "Plataforma de Saúde", setor: "Healthcare", ano: "2023", live: "https://cuidarbemcard.com.br", lead: "Empresa de saúde criada do zero.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80", tags: "Saúde, 0→1, Branding", desafio: "", solucao: "", resultado: "" },
        { id: "greenfuturehub", name: "Green Future Hub", eyebrow: "ESG", setor: "ESG", ano: "2024", live: "https://greenfuturehub.com.br", lead: "Ecossistema colaborativo de inovação sustentável.", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80", tags: "ESG, Hub, Sustentabilidade", desafio: "", solucao: "", resultado: "" },
        { id: "centrodediagnostico", name: "Centro de Diagnóstico", eyebrow: "Saúde", setor: "Healthcare", ano: "2024", live: "https://centrodediagnostico.com.br", lead: "Clínica de diagnóstico por imagem com 20+ anos de história.", image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=2000&q=80", tags: "Saúde, IA, Multi-convênio", desafio: "", solucao: "", resultado: "" },
      ];
      localStorage.setItem("naveo_cases", JSON.stringify(seed));
      return seed;
    },
    get(id) {
      return this.all().find((c) => c.id === id);
    },
    save(item) {
      const list = this.all();
      const idx = list.findIndex((c) => c.id === item.id);
      if (idx >= 0) list[idx] = item;
      else list.unshift(item);
      localStorage.setItem("naveo_cases", JSON.stringify(list));
    },
    delete(id) {
      const list = this.all().filter((c) => c.id !== id);
      localStorage.setItem("naveo_cases", JSON.stringify(list));
    },
  },

  // MESSAGES
  messages: {
    all() {
      const raw = localStorage.getItem("naveo_messages");
      if (raw) return JSON.parse(raw);
      const seed = [
        { id: "m1", nome: "Carlos Mendes", email: "carlos@agrofarm.com.br", empresa: "AgroFarm", telefone: "(65) 98888-1234", interesse: "Marketplace", mensagem: "Tenho uma operação de comércio de máquinas e queria explorar a possibilidade de uma plataforma similar ao Agrodesapego, mas vertical pro setor.", date: "2025-11-22T10:14:00", read: false },
        { id: "m2", nome: "Ana Souza", email: "ana@clinicvision.com.br", empresa: "ClinicVision", telefone: "(11) 97777-5566", interesse: "IA aplicada / Agentes", mensagem: "Somos uma clínica de oftalmologia e queremos automatizar o atendimento WhatsApp de pacientes — triagem inicial e agendamento.", date: "2025-11-21T15:42:00", read: false },
        { id: "m3", nome: "Roberto Lima", email: "roberto@bypme.com", empresa: "BY PME", telefone: "(31) 96666-9999", interesse: "Sistemas sob medida", mensagem: "ERP atual não atende mais. Pequena rede com 4 lojas físicas + e-commerce, precisamos unificar.", date: "2025-11-20T09:28:00", read: true },
        { id: "m4", nome: "Juliana Castro", email: "juliana@flowtech.io", empresa: "FlowTech", telefone: "(48) 99999-3333", interesse: "Performance / Vendas", mensagem: "Time de vendas crescendo, CRM atual virou bagunça. Queria entender como vocês estruturam funil + automação.", date: "2025-11-19T14:05:00", read: true },
      ];
      localStorage.setItem("naveo_messages", JSON.stringify(seed));
      return seed;
    },
    markRead(id) {
      const list = this.all();
      const m = list.find((x) => x.id === id);
      if (m) {
        m.read = true;
        localStorage.setItem("naveo_messages", JSON.stringify(list));
      }
    },
    delete(id) {
      const list = this.all().filter((m) => m.id !== id);
      localStorage.setItem("naveo_messages", JSON.stringify(list));
    },
    unreadCount() {
      return this.all().filter((m) => !m.read).length;
    },
  },
};

// ============================================================
// UI HELPERS
// ============================================================
const UI = {
  toast(msg, type = "success") {
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 400);
    }, 2400);
  },
  confirm(title, body) {
    return new Promise((resolve) => {
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop show";
      backdrop.innerHTML = `
        <div class="modal">
          <div class="modal__title">${title}</div>
          <div class="modal__body">${body}</div>
          <div class="modal__actions">
            <button class="btn-admin btn-admin--ghost" data-action="cancel">Cancelar</button>
            <button class="btn-admin btn-admin--danger" data-action="confirm">Confirmar</button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
      backdrop.querySelector('[data-action="cancel"]').onclick = () => {
        backdrop.remove();
        resolve(false);
      };
      backdrop.querySelector('[data-action="confirm"]').onclick = () => {
        backdrop.remove();
        resolve(true);
      };
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          backdrop.remove();
          resolve(false);
        }
      };
    });
  },
  formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  },
  formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  },
  slugify(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
  },
};

// ============================================================
// EXPORT TO WINDOW
// ============================================================
window.Naveo = { Auth, Storage, UI };
