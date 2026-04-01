import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { SeedService } from './seed.service';
import { Hydrant } from '../hydrants/hydrant.entity';

/**
 * Das Benutzer-Modul der Anwendung.
 * Verwaltet die Benutzerkonten, Rollenzuweisungen und die initiale Datenbefüllung (Seeding).
 * Stellt den UsersService für die Authentifizierung bereit und integriert die 
 * TypeORM-Entitäten für Benutzer und Hydranten.
 * 
 * @module UsersModule
 */
@Module({
    imports: [TypeOrmModule.forFeature([User, Hydrant])],
    providers: [UsersService, SeedService],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule { }
