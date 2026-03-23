import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getArg(name) {
  const withEquals = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (withEquals) return withEquals.split("=").slice(1).join("=");
  const idx = process.argv.findIndex((arg) => arg === name);
  if (idx >= 0) return process.argv[idx + 1];
  return undefined;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function printUsage() {
  console.log("Uso:");
  console.log("  node scripts/clear-test-users.mjs --email usuario@dominio.com");
  console.log("  node scripts/clear-test-users.mjs --domain test.com");
  console.log("  node scripts/clear-test-users.mjs --all --confirm");
}

async function main() {
  const email = getArg("--email");
  const domain = getArg("--domain");
  const clearAll = hasFlag("--all");
  const confirm = hasFlag("--confirm");

  if (!email && !domain && !clearAll) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (clearAll && !confirm) {
    console.error("Para borrar TODOS los usuarios debes pasar --confirm.");
    process.exitCode = 1;
    return;
  }

  let where;
  if (clearAll) {
    where = {};
  } else if (email) {
    where = { email: email.toLowerCase().trim() };
  } else {
    where = { email: { endsWith: `@${domain.toLowerCase().trim()}` } };
  }

  const result = await prisma.profile.deleteMany({ where });
  console.log(`Usuarios borrados: ${result.count}`);
}

main()
  .catch((e) => {
    console.error("Error al borrar usuarios:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
