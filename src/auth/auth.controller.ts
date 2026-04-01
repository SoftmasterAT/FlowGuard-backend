import { Controller, Post, Body, Req, UnauthorizedException, Get } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Kontrolliert alle Authentifizierungs-Vorgänge wie Login, Logout und die Statusabfrage.
 * Verwalte die Benutzer-Sessions über Redis und führt Passwort-Verifikationen mittels bcrypt durch.
 */
@Controller('auth')
export class AuthController {
    /**
     * Initialisiert den AuthController mit dem UsersService.
     * 
     * @param {UsersService} usersService - Service für den Datenbankzugriff auf Benutzerdaten.
     */
    constructor(private readonly usersService: UsersService) { }

    /**
     * Authentifiziert einen Benutzer anhand von E-Mail und Passwort.
     * Bei Erfolg werden die Benutzerdaten (ID, E-Mail, Rolle) in der Redis-Session gespeichert.
     * 
     * @param {any} body - Enthält die Anmeldedaten (email, password).
     * @param {Request} req - Das Express Request-Objekt zur Session-Verwaltung.
     * @returns {Promise<{message: string, role: string}>} Erfolgsmeldung und Benutzerrolle.
     * @throws {UnauthorizedException} Wenn die Anmeldedaten ungültig sind.
     */
    @Post('login')
    async login(@Body() body: any, @Req() req: Request) {
        const { email, password } = body;

        // 1. User in der Datenbank suchen
        const user = await this.usersService.findOneByEmail(email);

        // 2. Passwort vergleichen (Gehashtes Passwort vs. Eingabe)
        if (user && await bcrypt.compare(password, user.password)) {
            // 3. WICHTIG: User-Daten in die Redis-Session schreiben
            // @ts-ignore
            req.session.user = { id: user.id, email: user.email, role: user.role };

            return { message: 'Erfolgreich eingeloggt', role: user.role };
        }

        throw new UnauthorizedException('Ungültige Anmeldedaten');
    }

    /**
     * Ruft die Session-Informationen des aktuell angemeldeten Benutzers ab.
     * 
     * @param {Request} req - Das Express Request-Objekt mit der Session.
     * @returns {Promise<any>} Die in der Session gespeicherten Benutzerdaten.
     * @throws {UnauthorizedException} Wenn keine aktive Session existiert.
     */
    @Get('status')
    async status(@Req() req: Request) {
        // @ts-ignore
        if (req.session.user) {
            // @ts-ignore
            return req.session.user;
        }
        throw new UnauthorizedException('Nicht eingeloggt');
    }

    /**
     * Beendet die aktuelle Benutzer-Session und löscht die Daten aus dem Redis-Speicher.
     * 
     * @param {Request} req - Das Express Request-Objekt.
     * @returns {Promise<{message: string}>} Bestätigung der Abmeldung.
     */
    @Post('logout')
    async logout(@Req() req: Request) {
        req.session.destroy(() => { });
        return { message: 'Erfolgreich abgemeldet' };
    }
}
