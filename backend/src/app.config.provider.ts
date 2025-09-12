import { Provider } from '@nestjs/common';

// Интерфейсы конфигурации
export interface AppConfig {
  database: AppConfigDatabase;
  debug: string;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

// Функция для создания конфига
function createConfig(): AppConfig {
  const databaseDriver = process.env.DATABASE_DRIVER;
  const databaseUrl = process.env.DATABASE_URL;
  const debug = process.env.DEBUG || '*';

  if (!databaseDriver) throw new Error('DATABASE_DRIVER is not set');
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  return {
    database: {
      driver: databaseDriver,
      url: databaseUrl,
    },
    debug,
  };
}

// Провайдер без `imports`!
export const configProvider: Provider = {
  provide: 'CONFIG',
  useFactory: (): AppConfig => {
    return createConfig();
  },
};

export const CONFIG_PROVIDER = 'CONFIG';
