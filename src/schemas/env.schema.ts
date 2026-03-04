import { z } from 'zod';

// Schéma Zod complet pour les variables d'environnement
export const EnvSchema = z.object({

  // ─── App ──────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  APP_NAME: z.string().min(1),
  APP_VERSION: z.string().regex(/^\d+\.\d+\.\d+$/, 'Format: X.Y.Z'),
  PORT: z.string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 65535, 'Port invalide'),
  HOST: z.string().min(1),

  // ─── Base de données ──────────────────────────────
  DB_HOST:     z.string().min(1),
  DB_PORT:     z.string().transform((val) => parseInt(val, 10)),
  DB_NAME:     z.string().min(1),
  DB_USER:     z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_SSL:      z.string()
    .transform((val) => val === 'true'),

  // ─── Auth ─────────────────────────────────────────
  JWT_SECRET: z.string().min(16, 'JWT_SECRET trop court (min 16 chars)'),
  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, 'Format: 1s, 5m, 12h, 7d'),

  // ─── Email ────────────────────────────────────────
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),

  // ─── Feature flags ────────────────────────────────
  FEATURE_REGISTRATION: z.string().transform((val) => val === 'true'),
  FEATURE_PAYMENTS:     z.string().transform((val) => val === 'true'),
  MAX_UPLOAD_SIZE_MB:   z.string().transform((val) => parseInt(val, 10)),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
});

// Type inféré automatiquement depuis le schéma — pas besoin de le taper à la main !
export type EnvConfig = z.infer<typeof EnvSchema>;