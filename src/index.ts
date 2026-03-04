import * as readline from 'readline';
import { ConfigManager } from './config/config.manager';
import {
  displayWelcome,
  displayMenu,
  displayConfig,
  displaySummary,
} from './utils/display';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> =>
  new Promise((resolve) => rl.question(prompt, resolve));

// Initialise le singleton
const config = ConfigManager.getInstance();

const main = async (): Promise<void> => {
  displayWelcome();

  // Charge et valide la config — plante si invalide
  config.init();

  while (true) {
    displayMenu();
    const choice = (await question('Votre choix : ')).trim().toLowerCase();

    switch (choice) {

      case '1': {
        // Affiche tout avec les valeurs sensibles masquées
        displayConfig(config.getSafeConfig());
        break;
      }

      case '2': {
        displaySummary(
          config.get('NODE_ENV'),
          config.app,
          config.database,
          config.features
        );
        break;
      }

      case '3': {
        const db = config.database;
        console.log('\n🗄️  Configuration Base de données :\n');
        console.log(`  Host     : ${db.host}`);
        console.log(`  Port     : ${db.port}`);
        console.log(`  Database : ${db.name}`);
        console.log(`  User     : ${db.user}`);
        console.log(`  Password : ***masked***`);
        console.log(`  SSL      : ${db.ssl ? '✅' : '❌'}`);
        console.log(`  URL      : postgresql://${db.user}:***@${db.host}:${db.port}/${db.name}\n`);
        break;
      }

      case '4': {
        const f = config.features;
        console.log('\n🎛️  Feature Flags :\n');
        console.log(`  Inscription   : ${f.registration ? '✅ Activé' : '❌ Désactivé'}`);
        console.log(`  Paiements     : ${f.payments     ? '✅ Activé' : '❌ Désactivé'}`);
        console.log(`  Upload max    : ${f.maxUploadSizeMb} MB`);
        console.log(`  Log level     : ${f.logLevel}\n`);
        break;
      }

      case '5': {
        console.log('\n🧪 Simulation d\'une variable manquante...\n');
        const saved = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;

        const result = (await import('./schemas/env.schema')).EnvSchema.safeParse(process.env);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            console.log(`  ✗ ${issue.path.join('.')} — ${issue.message}`);
          });
        }

        // Restaure la valeur
        process.env.JWT_SECRET = saved;
        console.log('\n✅ Variable restaurée.\n');
        break;
      }

      case 'q': {
        console.log('\n👋 À bientôt !\n');
        rl.close();
        return;
      }

      default:
        console.log('\n❌ Choix invalide.\n');
    }
  }
};

main();