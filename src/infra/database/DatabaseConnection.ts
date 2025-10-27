import { Pool, type PoolConfig } from "pg";

// Interface type-safe para configuração
interface DatabaseConfig extends PoolConfig {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

export class DatabaseConnection {
  private static instance: Pool;

  private static getConfig(): DatabaseConfig {
    return {
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ...(process.env.NODE_ENV === "production" && {
        ssl: { rejectUnauthorized: false },
      }),
    };
  }

  static getInstance(): Pool {
    if (!this.instance) {
      const config = this.getConfig();
      this.instance = new Pool(config);
    }
    return this.instance;
  }

  static async query(text: string, params?: any[]): Promise<{ rows: any[] }> {
    const client = await this.getInstance().connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error("Unknown database error occurred");
    } finally {
      client.release();
    }
  }
}
