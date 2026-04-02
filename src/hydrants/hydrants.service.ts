import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hydrant } from './hydrant.entity';
import { PressureLog } from './pressure-log.entity';

/**
 * Service zur Verwaltung und Abfrage von Hydranten-Daten.
 */
@Injectable()
export class HydrantsService {
    constructor(
        @InjectRepository(Hydrant) private hydrantRepo: Repository<Hydrant>,
        @InjectRepository(PressureLog) private logRepo: Repository<PressureLog>,
    ) { }

    /**
     * Ruft die vollständige Liste aller gespeicherten Hydranten ab.
     * Gibt ein Array mit allen Datensätzen aus der Datenbank zurück.
     * 
     * @returns {Promise<Hydrant[]>} Ein Promise, das die Liste der Hydranten-Objekte auflöst.
     */
    async findAll(): Promise<Hydrant[]> {
        return this.hydrantRepo.find();
    }

     /**
     * Sucht einen spezifischen Hydranten anhand seiner ID inklusive der zugehörigen Messhistorie.
     * Lädt die verknüpften Druck-Logs (One-to-Many) automatisch mit, sortiert diese 
     * chronologisch absteigend und limitiert das Ergebnis auf die neuesten 20 Einträge.
     * Dies stellt sicher, dass Diagramme im Frontend (z.B. Highcharts) sofort nach einem 
     * Update oder einer Einzelabfrage mit aktuellen Daten versorgt werden.
     * 
     * @param {number} id - Die eindeutige ID des gesuchten Hydranten.
     * @returns {Promise<Hydrant | null>} Ein Promise, das den Hydranten inklusive limitierter Logs 
     * oder null liefert, falls kein Datensatz existiert.
     */
    async findOne(id: number): Promise<Hydrant | null> {
        return this.hydrantRepo.findOne({
            where: { id },
            relations: { logs: true }, // Lädt die verknüpften Logs aus der Datenbank
            order: { 
                logs: { timestamp: 'DESC' } // Neueste Messwerte zuerst
            }
        }).then(hydrant => {
            if (hydrant && hydrant.logs) {
                // Begrenzung im Speicher, um das Antwortvolumen (JSON) klein zu halten
                hydrant.logs = hydrant.logs.slice(0, 20);
            }
            return hydrant;
        });
    }


    /**
     * Ruft die aktuellsten Druckmesswerte eines Hydranten aus der Datenbank ab.
     * Die Ergebnisse werden chronologisch absteigend sortiert und auf eine 
     * definierte Anzahl begrenzt, um die Performance des Diagramms zu optimieren.
     * 
     * @param {number} hydrantId - Die ID des Hydranten, dessen Logs geladen werden.
     * @param {number} [limit=20] - Die maximale Anzahl der zurückgegebenen Messwerte.
     * @returns {Promise<PressureLog[]>} Ein Promise mit dem Array der Druck-Logs.
     */
    async getPressureLogs(hydrantId: number, limit = 20): Promise<PressureLog[]> {
        return this.logRepo.find({
            where: { hydrant: { id: hydrantId } },
            order: { timestamp: 'DESC' },
            take: limit
        });
    }

    /**
     * Ruft die Liste aller Hydranten für die Übersicht ab (Karte/Sidebar).
     * Um die Netzwerklast zu minimieren, werden hier nur die Stammdaten und der 
     * aktuelle Druckwert ohne die historische Messhistorie (Logs) geladen.
     * Die Sortierung erfolgt alphabetisch nach dem Namen.
     * 
     * @returns {Promise<Hydrant[]>} Liste der Hydranten für die performante Initialanzeige.
     */
    async findAllWithLivePressure(): Promise<Hydrant[]> {
        return this.hydrantRepo.find({
            order: { name: 'ASC' }
        });
    }

    /**
     * Simuliert einen massiven Druckabfall (Leck) für einen spezifischen Hydranten.
     * Aktualisiert den Status des Hydranten in der Datenbank auf 'CRITICAL',
     * setzt den Druckwert herab und erstellt unmittelbar einen entsprechenden 
     * Log-Eintrag für die Echtzeit-Visualisierung im Diagramm.
     * 
     * @param {number} id - Die ID des Hydranten, bei dem das Leck ausgelöst werden soll.
     * @returns {Promise<{message: string}>} Ein Promise mit einer Bestätigungsmeldung.
     */
    async simulateLeak(id: number) {
        const hydrant = await this.hydrantRepo.findOneBy({ id });
        if (hydrant) {
            // Wir setzen den Druck massiv runter
            hydrant.currentPressure = 0.4;
            hydrant.status = 'CRITICAL';
            await this.hydrantRepo.save(hydrant);

            // Wir erstellen sofort einen Log-Eintrag für den Graphen
            const log = this.logRepo.create({
                value: 0.4,
                hydrant: hydrant
            });
            await this.logRepo.save(log);

            return { message: `Leak simulated for ${hydrant.name}` };
        }
    }

    /**
     * Führt die Reparatur eines Hydranten in der Datenbank durch.
     * Setzt den Status auf 'OK', aktualisiert den aktuellen Druckwert auf den 
     * Standardwert und erstellt einen neuen Log-Eintrag, um die Wiederherstellung 
     * im Druckverlauf-Diagramm sichtbar zu machen.
     * 
     * @param {number} id - Die ID des zu reparierenden Hydranten.
     * @returns {Promise<{message: string} | undefined>} Ein Promise mit der Bestätigungsmeldung.
     */
    async repairHydrant(id: number) {
        const hydrant = await this.hydrantRepo.findOneBy({ id });
        if (hydrant) {
            hydrant.currentPressure = 5.0;
            hydrant.status = 'OK';
            await this.hydrantRepo.save(hydrant);

            // Messwert in Historie schreiben, damit man den Sprung im Graphen sieht
            await this.logRepo.save(this.logRepo.create({ value: 5.0, hydrant }));
            return { message: `${hydrant.name} wurde repariert.` };
        }
    }

    /**
     * Erstellt einen neuen Hydranten-Datensatz in der Datenbank.
     * Initialisiert den aktuellen Druck entweder mit dem übergebenen Basisdruck 
     * oder einem Standardwert von 4.0 Bar und setzt den Status initial auf 'OK'.
     * 
     * @param {Partial<Hydrant>} data - Die Teildaten für den neuen Hydranten (z. B. Name, Koordinaten).
     * @returns {Promise<Hydrant>} Ein Promise, das den vollständig erstellten Hydranten zurückgibt.
     */
    async create(data: Partial<Hydrant>): Promise<Hydrant> {
        const { logs, ...cleanData } = data;
        const hydrant = this.hydrantRepo.create({
            ...cleanData,
            currentPressure: cleanData.basePressure || 4.0,
            status: 'OK'
        });
        return this.hydrantRepo.save(hydrant);
    }

    /**
     * Aktualisiert einen bestehenden Hydranten mit den übergebenen Teildaten.
     * Führt die Änderungen in der Datenbank aus und gibt anschließend den 
     * vollständig aktualisierten Datensatz zurück.
     * 
     * @param {number} id - Die eindeutige ID des zu aktualisierenden Hydranten.
     * @param {Partial<Hydrant>} data - Die geänderten Attribute des Hydranten.
     * @returns {Promise<Hydrant | null>} Ein Promise mit dem aktualisierten Hydranten oder null.
     */
    async update(id: number, updateData: any) {
        const { logs, ...cleanData } = updateData; 
        
        await this.hydrantRepo.update(id, cleanData);
        return this.findOne(id);
    }

    /**
     * Entfernt einen Hydranten und alle zugehörigen Messwerte unwiderruflich.
     * Löscht zuerst alle verknüpften PressureLogs, um Foreign-Key-Beschränkungen 
     * in der Datenbank zu erfüllen, und anschließend den Hydranten-Stammdatensatz.
     * 
     * @param {number} id - Die ID des zu löschenden Hydranten.
     * @returns {Promise<void>} Ein Promise, das nach erfolgreichem Löschvorgang aufgelöst wird.
     */
    async remove(id: number): Promise<void> {
        // Zuerst die Logs löschen (wegen Foreign Key Constraints)
        await this.logRepo.delete({ hydrant: { id } });
        // Dann den Hydranten löschen
        await this.hydrantRepo.delete(id);
    }


}
