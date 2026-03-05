import { EnvConfig } from '../schemas/env.schema';

// Re-export pour usage externe
export type { EnvConfig };

// Types extraits directement depuis les retours des getters
export type AppConfig = {
  name:    string;
  version: string;
  env:     'development' | 'staging' | 'production';
  port:    number;
  host:    string;
};

export type DatabaseConfig = {
  host:     string;
  port:     number;
  name:     string;
  user:     string;
  password: string;
  ssl:      boolean;
  url:      string;
};

export type AuthConfig = {
  jwtSecret:    string;
  jwtExpiresIn: string;
};

export type EmailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

export type FeaturesConfig = {
  registration:    boolean;
  payments:        boolean;
  maxUploadSizeMb: number;
  logLevel:        'debug' | 'info' | 'warn' | 'error';
};