/* ==========================================================================
   Naveo Admin — vanilla JS
   Auth + Storage layer agora consome /api/* (Cloudflare Worker + Neon Postgres).
   ========================================================================== */

// ============================================================
// API HELPER
// ============================================================
const API = {
  token() {
    return localStorage.getItem("naveo_admin_token") || "";
  },
  async fetch(path, options = {}) {
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      options.headers || {}
    );
    const tok = this.token();
    if (tok) headers["Authorization"] = "Bearer " + tok;

    const res = await fetch(path, Object.assign({}, options, { headers }));
    if (res.status === 401) {
      // Sessão inválida — força logout
      Auth.logout();
      throw new Error("Sessão expirada");
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Erro " + res.status);
    }
    return res.json();
  },
  get(path) {
    return this.fetch(path);
  },
  post(path, body) {
    return this.fetch(path, { method: "POST", body: JSON.stringify(body) });
  },
  patch(path, body) {
    return this.fetch(path, { method: "PATCH", body: JSON.stringify(body) });
  },
  delete(path) {
    return this.fetch(path, { method: "DELETE" });
  },
};

// ============================================================
// AUTH (token bearer guardado em localStorage)
// ============================================================
const Auth = {
  isLogged() {
    return !!localStorage.getItem("naveo_admin_token");
  },
  async login(email, password) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem("naveo_admin_token", data.token);
      localStorage.setItem("naveo_admin_email", data.email);
      return true;
    } catch (_) {
      return false;
    }
  },
  logout() {
    localStorage.removeItem("naveo_admin_token");
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
    return localStorage.getItem("naveo_admin_email") || "";
  },
};

// ============================================================
// STORAGE — agora async, consome /api/*
// API igual a antes, só que todos retornam Promises
// ============================================================
const Storage = {
  // -------- POSTS --------
  posts: {
    all() {
      return API.get("/api/posts");
    },
    get(id) {
      return API.get("/api/posts/" + encodeURIComponent(id));
    },
    save(post) {
      return API.post("/api/posts", post);
    },
    delete(id) {
      return API.delete("/api/posts/" + encodeURIComponent(id));
    },
  },

  // -------- CASES --------
  cases: {
    all() {
      return API.get("/api/cases");
    },
    get(id) {
      return API.get("/api/cases/" + encodeURIComponent(id));
    },
    save(item) {
      return API.post("/api/cases", item);
    },
    delete(id) {
      return API.delete("/api/cases/" + encodeURIComponent(id));
    },
  },

  // -------- MESSAGES --------
  messages: {
    all() {
      return API.get("/api/messages");
    },
    markRead(id, read = true) {
      return API.patch("/api/messages/" + encodeURIComponent(id), { read });
    },
    delete(id) {
      return API.delete("/api/messages/" + encodeURIComponent(id));
    },
    async unreadCount() {
      const list = await this.all();
      return list.filter((m) => !m.read).length;
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
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  },
  formatDateTime(iso) {
    if (!iso) return "—";
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
  loader(parent) {
    const el = document.createElement("div");
    el.className = "loader-inline";
    el.innerHTML = '<div class="loader-inline__spinner"></div>';
    if (parent) parent.appendChild(el);
    return el;
  },
};

// ============================================================
// EXPORT TO WINDOW
// ============================================================
window.Naveo = { API, Auth, Storage, UI };
