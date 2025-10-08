import { Provider } from '@nestjs/common';

// Интерфейсы конфигурации
export interface AppConfig {
  database: AppConfigDatabase;
  debug: string;
}

export interface AppConfigDatabase {
  driver: 'mongodb' | 'postgres';
  url?: string; // только для MongoDB
  // Поля для PostgreSQL (опционально, если нужны вне TypeORM)
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

// Функция для создания конфига
function createConfig(): AppConfig {
  const databaseDriver = process.env.DATABASE_DRIVER?.trim();
  const debug = process.env.DEBUG || '*';

  if (!databaseDriver) {
    throw new Error('DATABASE_DRIVER is not set');
  }

  if (databaseDriver === 'mongodb') {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required for MongoDB');
    }
    return {
      database: {
        driver: 'mongodb',
        url: databaseUrl,
      },
      debug,
    };
  }

  if (databaseDriver === 'postgres') {
    return {
      database: {
        driver: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      debug,
    };
  }

  throw new Error(`Unsupported DATABASE_DRIVER: ${databaseDriver}`);
}

// Провайдер для NestJS
export const CONFIG_PROVIDER = 'CONFIG';

export const configProvider: Provider = {
  provide: CONFIG_PROVIDER,
  useFactory: createConfig,
};
