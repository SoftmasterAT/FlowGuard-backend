import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Hydrant } from '../hydrants/hydrant.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Hydrant) private readonly hydrantRepository: Repository<Hydrant>,
    ) { }

    async onApplicationBootstrap() {
        const adminEmail = process.env['ADMIN_EMAIL'];
        const adminPassword = process.env['ADMIN_PASSWORD'];

        if (!adminEmail || !adminPassword) {
            console.error('❌ FEHLER: ADMIN_EMAIL oder ADMIN_PASSWORD in .env nicht gefunden!');
            return;
        }
        // Admin erstellen
        const adminExists = await this.userRepository.findOne({ where: { role: UserRole.ADMIN } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const admin = this.userRepository.create({
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
            });

            await this.userRepository.save(admin);
            console.log(`✅ Standard-Admin erstellt: ${adminEmail}`);
        }

        // Hydranten erstellen
        const count = await this.hydrantRepository.count();
        if (count === 0) { // Falls wir nur die alten 3 haben, füllen wir auf
            const viennaLocations = [
                {
                    "id": 1,
                    "name": "Stephansplatz-Nord",
                    "lat": 48.2081267827033,
                    "lng": 16.3727080821991,
                    "status": "WARNING",
                    "basePressure": 4.2,
                    "currentPressure": 3.15
                },
                {
                    "id": 2,
                    "name": "Stephansdom Süd",
                    "lat": 48.2089362283951,
                    "lng": 16.3732123374939,
                    "status": "WARNING",
                    "basePressure": 4.5,
                    "currentPressure": 3.13
                },
                {
                    "id": 3,
                    "name": "Praterstern",
                    "lat": 48.2178086931561,
                    "lng": 16.3910222053528,
                    "status": "WARNING",
                    "basePressure": 3.8,
                    "currentPressure": 3.26
                },
                {
                    "id": 4,
                    "name": "Schönbrunn-Nord",
                    "lat": 48.1857513040551,
                    "lng": 16.3133347034454,
                    "status": "WARNING",
                    "basePressure": 4.5,
                    "currentPressure": 3.25
                },
                {
                    "id": 5,
                    "name": "Schönbrunn-Süd",
                    "lat": 48.1860195306851,
                    "lng": 16.3122645020485,
                    "status": "WARNING",
                    "basePressure": 4.8,
                    "currentPressure": 2.78
                },
                {
                    "id": 6,
                    "name": "Karlsplatz",
                    "lat": 48.1990635978224,
                    "lng": 16.3703584671021,
                    "status": "WARNING",
                    "basePressure": 4.1,
                    "currentPressure": 3.07
                },
                {
                    "id": 7,
                    "name": "Rathausplatz West",
                    "lat": 48.2108685894962,
                    "lng": 16.3596215844154,
                    "status": "WARNING",
                    "basePressure": 4.3,
                    "currentPressure": 3.29
                },
                {
                    "id": 8,
                    "name": "Westbahnhof",
                    "lat": 48.1956594658759,
                    "lng": 16.3386172056198,
                    "status": "CRITICAL",
                    "basePressure": 3.9,
                    "currentPressure": 2.01
                },
                {
                    "id": 9,
                    "name": "Heldenplatz Trinkwasser",
                    "lat": 48.2061532489138,
                    "lng": 16.3633686304092,
                    "status": "WARNING",
                    "basePressure": 4.5,
                    "currentPressure": 3.06
                },
                {
                    "id": 10,
                    "name": "Belvedere Garten",
                    "lat": 48.1920973399193,
                    "lng": 16.3831794261932,
                    "status": "CRITICAL",
                    "basePressure": 4.6,
                    "currentPressure": 2.38
                },
                {
                    "id": 11,
                    "name": "Naschmarkt Mitte",
                    "lat": 48.1978995563864,
                    "lng": 16.3622984290123,
                    "status": "CRITICAL",
                    "basePressure": 4,
                    "currentPressure": 2.44
                },
                {
                    "id": 12,
                    "name": "Donaukanal Schwedenplatz",
                    "lat": 48.2112958968445,
                    "lng": 16.3783541321755,
                    "status": "WARNING",
                    "basePressure": 4.4,
                    "currentPressure": 3.26
                },
                {
                    "id": 13,
                    "name": "Heldenplatz Hydrant/Trinkwasser",
                    "lat": 48.2066555575963,
                    "lng": 16.3642027974129,
                    "status": "WARNING",
                    "basePressure": 4.7,
                    "currentPressure": 3.64
                },
                {
                    "id": 14,
                    "name": "Museumsquartier",
                    "lat": 48.2030232289212,
                    "lng": 16.359356045723,
                    "status": "WARNING",
                    "basePressure": 4.2,
                    "currentPressure": 3.25
                },
                {
                    "id": 15,
                    "name": "Volksgarten Nord",
                    "lat": 48.2093242383949,
                    "lng": 16.3606086373329,
                    "status": "WARNING",
                    "basePressure": 4.5,
                    "currentPressure": 2.56
                },
                {
                    "id": 16,
                    "name": "Basiliskenbrunnen",
                    "lat": 48.2048085512196,
                    "lng": 16.381693482399,
                    "status": "WARNING",
                    "basePressure": 4.3,
                    "currentPressure": 3.23
                },
                {
                    "id": 17,
                    "name": "Stubentor Ring",
                    "lat": 48.2067522498563,
                    "lng": 16.3781771063805,
                    "status": "WARNING",
                    "basePressure": 4.1,
                    "currentPressure": 2.74
                },
                {
                    "id": 18,
                    "name": "Schwarzenbergplatz",
                    "lat": 48.1983570254643,
                    "lng": 16.37610912323,
                    "status": "WARNING",
                    "basePressure": 4.4,
                    "currentPressure": 2.84
                },
                {
                    "id": 19,
                    "name": "Votivkirche Park",
                    "lat": 48.2159176818566,
                    "lng": 16.3596430420876,
                    "status": "WARNING",
                    "basePressure": 4,
                    "currentPressure": 3.4
                },
                {
                    "id": 20,
                    "name": "Augarten Süd",
                    "lat": 48.224290564363,
                    "lng": 16.3744622468948,
                    "status": "WARNING",
                    "basePressure": 3.8,
                    "currentPressure": 2.95
                },
                {
                    "id": 21,
                    "name": "Mariahilfer Straße Mitte",
                    "lat": 48.1988335485136,
                    "lng": 16.3511804505671,
                    "status": "WARNING",
                    "basePressure": 4.2,
                    "currentPressure": 2.91
                },
                {
                    "id": 22,
                    "name": "Spittelberg Gasse",
                    "lat": 48.2033429097194,
                    "lng": 16.3552629947662,
                    "status": "OK",
                    "basePressure": 4.3,
                    "currentPressure": 4.06
                },
                {
                    "id": 23,
                    "name": "Rathauspark",
                    "lat": 48.2119377832072,
                    "lng": 16.3594901561737,
                    "status": "WARNING",
                    "basePressure": 4.1,
                    "currentPressure": 3.29
                },
                {
                    "id": 24,
                    "name": "Heidegarten",
                    "lat": 48.2367045676919,
                    "lng": 16.4106291532517,
                    "status": "WARNING",
                    "basePressure": 4.5,
                    "currentPressure": 2.62
                },
                {
                    "id": 25,
                    "name": "Augarten Trinkwasser",
                    "lat": 48.2266780367877,
                    "lng": 16.3710129261017,
                    "status": "WARNING",
                    "basePressure": 4.5,
                    "currentPressure": 2.98
                }
            ];

            for (const loc of viennaLocations) {
                const exists = await this.hydrantRepository.findOneBy({ name: loc.name });
                if (!exists) {
                    const h = this.hydrantRepository.create({
                        ...loc,
                        currentPressure: loc.basePressure,
                        status: 'OK'
                    });
                    await this.hydrantRepository.save(h);
                }
            }
            console.log(`🏙️ Wien Netz mit ${viennaLocations.length} Hydranten initialisiert!`);
        }

    }
}
