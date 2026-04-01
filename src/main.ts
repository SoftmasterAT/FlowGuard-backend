import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { ValidationPipe } from '@nestjs/common';

/**
 * Haupt-Bootstrap-Funktion der NestJS-Anwendung.
 * Konfiguriert den gesamten Application-Stack, einschließlich:
 * - Redis-Verbindung für das Session-Management (connect-redis).
 * - Express-Session Middleware mit Sicherheits-Einstellungen für Produktion (HTTPS/CORS).
 * - Globale Validierungs-Pipes für DTOs.
 * - CORS-Konfiguration für die Kommunikation mit dem Angular-Frontend.
 * 
 * @returns {Promise<void>}
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 1. Verbindung zu Redis herstellen (unser Session-Speicher)
    let redisUrl = process.env.REDIS_URL;
    if (!redisUrl || !redisUrl.startsWith('redis://')) {
        console.warn('Keine gültige REDIS_URL gefunden, nutze Localhost...');
        redisUrl = 'redis://localhost:6379';
    }

    const redisClient = createClient({ url: redisUrl });


    // 2. Redis Store für Express-Session initialisieren
    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    try {
        await redisClient.connect();
        console.log(`Verbunden mit Redis auf: ${redisUrl}`);
    } catch (err) {
        console.error('Konnte keine Verbindung zu Redis herstellen:', err);
    }

    const redisStore = new RedisStore({
        client: redisClient,
        prefix: 'flowguard_sess:', // Alle Session-Keys in Redis beginnen mit diesem Prefix
    });

    // 4. Session: 'secure' muss auf true, wenn HTTPS (Produktion) genutzt wird
    const isProduction = process.env.NODE_ENV === 'production';

    // 5. Session Middleware konfigurieren
    app.use(
        session({
            store: redisStore,
            secret: process.env.SESSION_SECRET || 'mein-super-geheimes-passwort-123',
            resave: false,
            saveUninitialized: false,
            name: 'flowguard_sid',
            // WICHTIG: Wenn 'unset' auf 'destroy' steht, löscht er die Session sauber aus Redis
            unset: 'destroy',
            cookie: {
                httpOnly: true,
                // WICHTIG: Auf Render (HTTPS) muss secure: true sein, lokal false
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax', // Nötig für Cross-Domain Cookies
                maxAge: 1000 * 60 * 60 * 24, // 24 Stunden
            },
        }),
    );

    // 6. Validierung global aktivieren (für DTOs)
    app.useGlobalPipes(new ValidationPipe());

    // 7. CORS für Angular erlauben
    app.enableCors({
        origin: [
            'http://localhost:4200', 
            'https://flowguard.softmaster.at' // Deine Angular-URL
        ],
        credentials: true, // Wichtig für Sessions/Cookies!
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // 8. Port: Render gibt den Port über process.env.PORT vor
    const port = process.env.PORT || 3000;
    await app.listen(port);
}
bootstrap();
