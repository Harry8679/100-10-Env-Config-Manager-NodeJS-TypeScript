import { EnvConfig } from '../schemas/env.schema';

const COLORS = {
  reset:  '\x1b[0m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  bold:   '\x1b[1m',
  gray:   '\x1b[90m',
};

const envColor = (env: string): string => ({
  development: COLORS.green,
  staging:     COLORS.yellow,
  production:  COLORS.red,
}[env] ?? COLORS.gray);

export const displayWelcome = (): void => {
  console.clear();
  console.log('╔══════════════════════════════════════╗');
  console.log('║   ⚙️  Environment Config Manager v1.0  ║');
  console.log('╚══════════════════════════════════════╝');
  console.log();
};

export const displayConfig = (config: Record<string, unknown>): void => {
  const entries = Object.entries(config);

  console.log(`\n${COLORS.bold}📋 Configuration complète :${COLORS.reset}\n`);

  const groups: Record<string, [string, unknown][]> = {
    '🚀 App':          [],
    '🗄️  Database':    [],
    '🔐 Auth':         [],
    '📧 Email':        [],
    '🎛️  Features':    [],
  };

  entries.forEach(([key, value]) => {
    if (['NODE_ENV','APP_NAME','APP_VERSION','PORT','HOST'].includes(key))
      groups['🚀 App'].push([key, value]);
    else if (key.startsWith('DB_'))
      groups['🗄️  Database'].push([key, value]);
    else if (key.startsWith('JWT_'))
      groups['🔐 Auth'].push([key, value]);
    else if (key.startsWith('SMTP_'))
      groups['📧 Email'].push([key, value]);
    else
      groups['🎛️  Features'].push([key, value]);
  });

  Object.entries(groups).forEach(([groupName, items]) => {
    if (items.length === 0) return;
    console.log(`  ${COLORS.bold}${groupName}${COLORS.reset}`);
    items.forEach(([key, value]) => {
      const val = String(value);
      const isMasked = val === '***masked***';
      const display  = isMasked
        ? `${COLORS.gray}${val}${COLORS.reset}`
        : `${COLORS.cyan}${val}${COLORS.reset}`;
      console.log(`    ${key.padEnd(25)} : ${display}`);
    });
    console.log();
  });
};

export const displaySummary = (
  env: string,
  app: { name: string; version: string; port: number },
  db:  { host: string; name: string },
  features: { registration: boolean; payments: boolean; logLevel: string }
): void => {
  const color = envColor(env);

  console.log(`\n${COLORS.bold}📊 Résumé :${COLORS.reset}\n`);
  console.log(`  Environnement : ${color}${COLORS.bold}${env.toUpperCase()}${COLORS.reset}`);
  console.log(`  Application   : ${app.name} v${app.version}`);
  console.log(`  Port          : ${app.port}`);
  console.log(`  Base de données: ${db.host}/${db.name}`);
  console.log(`  Inscription   : ${features.registration ? '✅' : '❌'}`);
  console.log(`  Paiements     : ${features.payments ? '✅' : '❌'}`);
  console.log(`  Log level     : ${features.logLevel}`);
  console.log();

  if (env === 'production') {
    console.log(`  ${COLORS.red}${COLORS.bold}⚠️  MODE PRODUCTION — Sois prudent !${COLORS.reset}\n`);
  }
};

export const displayValidationError = (errors: string[]): void => {
  console.log(`\n${COLORS.red}❌ Erreurs de validation :${COLORS.reset}\n`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log();
};

export const displayMenu = (): void => {
  console.log('─'.repeat(44));
  console.log('  [1] Afficher toute la configuration');
  console.log('  [2] Afficher le résumé');
  console.log('  [3] Afficher la config DB');
  console.log('  [4] Afficher les feature flags');
  console.log('  [5] Tester une clé manquante (simulation erreur)');
  console.log('  [q] Quitter');
  console.log('─'.repeat(44));
  console.log();
};