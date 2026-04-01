import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

/**
 * Das Authentifizierungsmodul der Anwendung.
 * Kapselt die Logik für Login, Logout und Session-Management. 
 * Importiert das UsersModule, um Zugriff auf Benutzerdaten für die 
 * Verifizierung zu erhalten.
 * 
 * @module AuthModule
 */
@Module({
    imports: [UsersModule],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }
