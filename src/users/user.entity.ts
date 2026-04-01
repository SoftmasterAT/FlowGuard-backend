import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Definiert die verfügbaren Benutzerrollen im System zur Berechtigungssteuerung.
 * @enum {string}
 */
export enum UserRole {
    ADMIN = 'admin',        /** Voller Zugriff auf alle Funktionen und Verwaltung */
    OPERATOR = 'operator',  /** Kann Daten bearbeiten und Simulationen steuern */
    VIEWER = 'viewer',      /** Nur Lesezugriff auf Karten und Diagramme */
}

/**
 * Datenbank-Entität für die Benutzerverwaltung.
 * Speichert Anmeldedaten und Berechtigungsstufen für den Zugriff auf das System.
 */
@Entity('users')
export class User {
    /** @type {number} Eindeutige Benutzer-ID (Primärschlüssel) */
    @PrimaryGeneratedColumn()
    id: number;

    /** @type {string} Eindeutige E-Mail-Adresse für den Login */
    @Column({ unique: true })
    email: string;

    /** @type {string} Das mittels bcrypt gehashte Passwort des Benutzers */
    @Column()
    password: string; // Wird verschlüsselt gespeichert!

    /** @type {UserRole} Die zugewiesene Berechtigungsrolle (Standard: VIEWER) */
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.VIEWER,
    })
    role: UserRole;
}
