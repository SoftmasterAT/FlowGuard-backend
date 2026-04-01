import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SimulationService } from './simulation.service';
import { HydrantsModule } from '../hydrants/hydrants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PressureLog } from '../hydrants/pressure-log.entity';
import { Hydrant } from '../hydrants/hydrant.entity';

/**
 * Das Simulations-Modul der Anwendung.
 * Verwaltet die Hintergrund-Tasks für die Wasserdruck-Simulation mithilfe von BullMQ.
 * Konfiguriert die Redis-Verbindung asynchron basierend auf der Umgebung (Render/Cloud oder Localhost)
 * und registriert die Queue 'water-simulation' für die Prozesssteuerung.
 * 
 * @module SimulationModule
 */
@Module({
    imports: [
        // BullModule jetzt asynchron konfigurieren
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const redisUrl = configService.get<string>('REDIS_URL');
                
                // Wenn eine komplette URL vorhanden ist (z.B. auf Render: rediss://...)
                if (redisUrl) {
                    return {
                        connection: { url: redisUrl },
                    };
                }

                // Fallback für Localhost (Docker)
                return {
                    connection: {
                        host: configService.get<string>('REDIS_HOST', 'localhost'),
                        port: configService.get<number>('REDIS_PORT', 6379),
                    },
                };
            },
        }),
        BullModule.registerQueue({
            name: 'water-simulation',
        }),
        HydrantsModule,
        TypeOrmModule.forFeature([Hydrant, PressureLog]),
    ],
    providers: [SimulationService],
})
export class SimulationModule { }
