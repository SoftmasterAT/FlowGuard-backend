import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * Service für den Zugriff auf die Benutzer-Datenbank.
 * Stellt Methoden bereit, um Benutzer-Entitäten zu suchen und zu verwalten,
 * primär für die Authentifizierung im AuthController.
 * 
 * @class UsersService
 */
@Injectable()
export class UsersService {
    /**
     * Initialisiert den UsersService mit dem Benutzer-Repository.
     * 
     * @param {Repository<User>} userRepository - Das TypeORM-Repository für die User-Entität.
     */
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    /**
     * Sucht einen spezifischen Benutzer anhand seiner eindeutigen E-Mail-Adresse.
     * Wird hauptsächlich während des Login-Prozesses zur Verifizierung verwendet.
     * 
     * @param {string} email - Die gesuchte E-Mail-Adresse des Benutzers.
     * @returns {Promise<User | null>} Ein Promise, das den gefundenen User oder null zurückgibt.
     */
    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }
}
