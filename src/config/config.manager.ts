import { EnvSchema, EnvConfig } from '../schemas/env.schema';
import { ConfigLoader }         from './config.loader';

export class ConfigManager {
  private static instance: ConfigManager;
  private config!: EnvConfig;

  // Pattern Singleton — une seule instance dans toute l'app
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // Charge et valide la configuration
  init(): void {
    ConfigLoader.load();

    const result = EnvSchema.safeParse(process.env);

    if (!result.success) {
      console.error('\n❌ Configuration invalide !\n');
      console.error('Variables manquantes ou invalides :\n');

      result.error.issues.forEach((issue) => {
        console.error(`  ✗ ${issue.path.join('.')} — ${issue.message}`);
      });

      console.error('\n💡 Vérifie ton fichier .env\n');
      process.exit(1);
    }

    this.config = result.data;
    console.log('✅ Configuration validée avec succès\n');
  }

  // Accesseurs typés
  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  getAll(): EnvConfig {
    return this.config;
  }

  // Accesseurs groupés par domaine
  get app() {
    return {
      name:        this.config.APP_NAME,
      version:     this.config.APP_VERSION,
      env:         this.config.NODE_ENV,
      port:        this.config.PORT,
      host:        this.config.HOST,
    };
  }

  get database() {
    return {
      host:     this.config.DB_HOST,
      port:     this.config.DB_PORT,
      name:     this.config.DB_NAME,
      user:     this.config.DB_USER,
      password: this.config.DB_PASSWORD,
      ssl:      this.config.DB_SSL,
      // Construit l'URL de connexion automatiquement
      url: `postgresql://${this.config.DB_USER}:${this.config.DB_PASSWORD}` +
           `@${this.config.DB_HOST}:${this.config.DB_PORT}/${this.config.DB_NAME}`,
    };
  }

  get auth() {
    return {
      jwtSecret:    this.config.JWT_SECRET,
      jwtExpiresIn: this.config.JWT_EXPIRES_IN,
    };
  }

  get email() {
    return {
      host: this.config.SMTP_HOST,
      port: this.config.SMTP_PORT,
      user: this.config.SMTP_USER,
      pass: this.config.SMTP_PASS,
    };
  }

  get features() {
    return {
      registration:    this.config.FEATURE_REGISTRATION,
      payments:        this.config.FEATURE_PAYMENTS,
      maxUploadSizeMb: this.config.MAX_UPLOAD_SIZE_MB,
      logLevel:        this.config.LOG_LEVEL,
    };
  }

  // Vérifie si on est dans un environnement donné
  isDev():     boolean { return this.config.NODE_ENV === 'development'; }
  isStaging(): boolean { return this.config.NODE_ENV === 'staging'; }
  isProd():    boolean { return this.config.NODE_ENV === 'production'; }

  // Masque les valeurs sensibles pour l'affichage
  getSafeConfig(): Record<string, unknown> {
    const sensitive = ['DB_PASSWORD', 'JWT_SECRET', 'SMTP_PASS'];
    const entries   = Object.entries(this.config).map(([key, value]) => [
      key,
      sensitive.includes(key) ? '***masked***' : value,
    ]);
    return Object.fromEntries(entries);
  }
}