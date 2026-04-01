import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

/**
 * Datenbank-Entität, die einen Wasserhydranten im Stadtnetz repräsentiert.
 * Enthält geografische Koordinaten, Statusinformationen sowie 
 * aktuelle und Soll-Druckwerte.
 */
@Entity('hydrants')
export class Hydrant {
    /** @type {number} Eindeutige ID (Primärschlüssel) */
    @PrimaryGeneratedColumn()
    id: number;

    /** @type {string} Bezeichnung des Hydranten (z. B. "Hydrant-Wien-01") */
    @Column()
    name: string; // z.B. "Hydrant-Wien-01"

    /** @type {number} Geografischer Breitengrad */
    @Column('float')
    lat: number; // Breitengrad

    /** @type {number} Geografischer Längengrad */
    @Column('float')
    lng: number; // Längengrad

    /** @type {string} Aktueller Betriebszustand (mögliche Werte: 'OK', 'WARNING', 'CRITICAL') */
    @Column({ default: 'OK' })
    status: string; // OK, WARNUNG, KRITISCH

    /** @type {number} Definierter Standard-Solldruck in Bar */
    @Column('float', { default: 4.5 })
    basePressure: number; // Der normale Solldruck in Bar

    /** @type {number} Derzeit gemessener Wasserdruck in Bar */
    @Column('float', { default: 4 })
    currentPressure: number;
}
