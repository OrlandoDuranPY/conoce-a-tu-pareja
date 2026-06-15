// Shared MySQL connection settings, read from discrete environment
// variables so the same code connects to a local (Laragon) database in
// development and to a managed MySQL instance in production by just
// changing env vars.

export function getDatabaseConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "conoce_a_tu_pareja",
  };
}

// Connection string form, used by the Prisma CLI (prisma.config.ts).
export function getDatabaseUrl() {
  const { host, port, user, password, database } = getDatabaseConfig();
  const credentials = password
    ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
    : encodeURIComponent(user);

  return `mysql://${credentials}@${host}:${port}/${database}`;
}
