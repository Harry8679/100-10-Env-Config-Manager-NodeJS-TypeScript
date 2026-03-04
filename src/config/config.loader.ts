import * as dotenv from 'dotenv';
import * as path   from 'path';
import * as fs     from 'fs';

export class ConfigLoader {

  static load(): void {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const envFile = `.env.${nodeEnv}`;
    const envPath = path.join(process.cwd(), 'envs', envFile);

    // Vérifie que le fichier existe
    if (!fs.existsSync(envPath)) {
      console.warn(`⚠️  Fichier ${envFile} introuvable, utilise .env.development`);
      const fallback = path.join(process.cwd(), 'envs', '.env.development');
      dotenv.config({ path: fallback });
      return;
    }

    dotenv.config({ path: envPath });
    console.log(`📂 Config chargée depuis : envs/${envFile}`);
  }
}