import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hydrant } from './hydrant.entity';
import { PressureLog } from './pressure-log.entity';
import { HydrantsService } from './hydrants.service';
import { HydrantsController } from './hydrants.controller';

/**
 * Das Hydranten-Modul der Anwendung.
 * Kapselt die gesamte Geschäftslogik, Datenhaltung und API-Endpunkte für die Hydrantenverwaltung.
 * Registriert die TypeORM-Entitäten für Hydranten und deren Druck-Historie (PressureLog)
 * und stellt den HydrantsService für andere Module zur Verfügung.
 * 
 * @module HydrantsModule
 */
@Module({
    imports: [TypeOrmModule.forFeature([Hydrant, PressureLog])],
    providers: [HydrantsService],
    controllers: [HydrantsController],
    exports: [HydrantsService],
})
export class HydrantsModule { }
