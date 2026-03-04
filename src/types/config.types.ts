import { EnvConfig } from '../schemas/env.schema';

// Re-export pour usage externe
export type { EnvConfig };

// Type pour les groupes de config
export type AppConfig      = ReturnType<ConfigManager['app']>;
export type DatabaseConfig = ReturnType<ConfigManager['database']>;
export type AuthConfig     = ReturnType<ConfigManager['auth']>;
export type EmailConfig    = ReturnType<ConfigManager['email']>;
export type FeaturesConfig = ReturnType<ConfigManager['features']>;

// Import nécessaire pour les ReturnType
import { ConfigManager } from '../config/config.manager';