import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { HydrantsModule } from './hydrants/hydrants.module';
import { SimulationModule } from './simulation/simulation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Das Hauptmodul (Root) der Anwendung.
 * Orchestriert die gesamte Anwendung durch die Integration von Konfigurationen, 
 * Datenbankverbindungen (TypeORM) und allen funktionalen Sub-Modulen.
 * 
 * Konfiguriert die PostgreSQL-Verbindung asynchron:
 * - Nutzt DATABASE_URL und SSL für Cloud-Umgebungen (z. B. Render).
 * - Nutzt Einzelparameter (Host, Port, etc.) für die lokale Entwicklung.
 * - Aktiviert `synchronize` nur außerhalb der Production-Umgebung.
 * 
 * @module AppModule
 */
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbUrl = configService.get<string>('DATABASE_URL');
                const isProd = configService.get<string>('NODE_ENV') === 'production';

                return {
                    type: 'postgres',
                    // Wenn DATABASE_URL vorhanden ist (Render), nutze diese. 
                    // Ansonsten die Einzelwerte für Localhost.
                    ...(dbUrl 
                        ? { url: dbUrl } 
                        : {
                            host: configService.get<string>('DB_HOST', 'localhost'),
                            port: configService.get<number>('DB_PORT', 5432),
                            username: configService.get<string>('DB_USERNAME'),
                            password: configService.get<string>('DB_PASSWORD'),
                            database: configService.get<string>('DB_NAME'),
                        }
                    ),
                    autoLoadEntities: true,
                    // Synchronize nur in Development (GEFÄHRLICH in Production!)
                    synchronize: !isProd, 
                    // SSL ist auf Render für Postgres meist Pflicht
                    ssl: isProd ? { rejectUnauthorized: false } : false,
                };
            },
        }),
        UsersModule,
        AuthModule,
        HydrantsModule,
        SimulationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
