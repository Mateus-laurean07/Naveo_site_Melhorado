// ============================================================================
// Reseta a senha do admin naveo@gmail.com pra "123456" (com hash correto).
// Uso: DATABASE_URL="postgresql://..." node scripts/reset-admin-password.mjs
// ============================================================================

import { neon } from "@neondatabase/serverless";
import { webcrypto as crypto } from "node:crypto";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL não setado.");
  process.exit(1);
}

const sql = neon(url);

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function main() {
  const email = "naveo@gmail.com";
  const newPassword = "123456";

  console.log(`🔄 Resetando senha do admin ${email}...`);

  // Gera salt NOVO + hash da senha com esse salt
  const salt = randomSalt();
  const password_hash = await sha256(newPassword + salt);

  console.log(`   Salt novo: ${salt}`);
  console.log(`   Hash gerado (64 chars): ${password_hash}`);

  const result = await sql`
    UPDATE users
    SET password_hash = ${password_hash},
        salt = ${salt},
        session_token = NULL,
        session_expires_at = NULL
    WHERE email = ${email}
    RETURNING id, email, name, length(password_hash) as hash_len, length(salt) as salt_len
  `;

  if (!result.length) {
    console.error(`❌ Usuário ${email} não encontrado.`);
    process.exit(1);
  }

  console.log("\n✅ Senha resetada com sucesso!");
  console.table(result);
  console.log(`\n👉 Faça login com: ${email} / ${newPassword}`);
}

main().catch((e) => {
  console.error("\n❌ Erro:", e.message);
  process.exit(1);
});
