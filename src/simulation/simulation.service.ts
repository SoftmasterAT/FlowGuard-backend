import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Hydrant } from '../hydrants/hydrant.entity';
import { PressureLog } from '../hydrants/pressure-log.entity';

let dataGenerationCount = 0;

/**
 * Service zur kontinuierlichen Simulation von Hydranten-Messwerten und Datenpflege.
 * Implementiert OnApplicationBootstrap, um Simulations-Intervalle beim Systemstart zu aktivieren.
 *
 * @class SimulationService
 */
@Injectable()
export class SimulationService implements OnApplicationBootstrap {

    /**
     * Initialisiert den Service mit den Repositories für Hydranten und Messprotokolle.
     * 
     * @param {Repository<Hydrant>} hydrantRepo - Zugriff auf die Hydranten-Stammdaten.
     * @param {Repository<PressureLog>} logRepo - Zugriff auf die historische Druckdatenbank.
     */
    constructor(
        @InjectRepository(Hydrant) private hydrantRepo: Repository<Hydrant>,
        @InjectRepository(PressureLog) private logRepo: Repository<PressureLog>,
    ) { }

    /**
     * Startet die Hintergrundprozesse der Anwendung nach erfolgreichem Bootstrapping.
     * Setzt ein 1-Sekunden-Intervall für die Datengenerierung und ein 
     * 10-Minuten-Intervall für die Datenbankbereinigung.
     */
    async onApplicationBootstrap() {
        console.log('🌊 Wasser-Simulation gestartet...');
        // 1. Simulation jede Sekunde
        setInterval(() => this.generateData(), 10000); 

        // 2. Cleanup alle 10 Minuten: Lösche alles, was älter als 24h ist
        setInterval(() => this.cleanupDatabase(), 10 * 60 * 1000);
    }

    /**
     * Bereinigt die Datenbank von veralteten Messwerten.
     * Löscht alle Druck-Logs, die älter als 24 Stunden sind, um die Performance 
     * der Datenbank und der Diagramme stabil zu halten.
     * 
     * @private
     */
    private async cleanupDatabase() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const result = await this.logRepo.delete({
            timestamp: LessThan(twentyFourHoursAgo)
        });
        
        console.log(`🧹 Cleanup: ${result.affected} alte Messwerte gelöscht.`);
    }

    /**
     * Generiert realistische Druckmesswerte für alle registrierten Hydranten.
     * Berechnet für jeden Hydranten basierend auf Basisdruck, Drift, Rauschen und 
     * Zufallsevents einen neuen Messwert, aktualisiert den Status ('OK', 'WARNING', 'CRITICAL') 
     * und schreibt den Wert in die Historie.
     * 
     * @private
     */
    private async generateData() {
        const hydrants = await this.hydrantRepo.find();

        for (const h of hydrants) {
            const basePressure = 3.8 + (h.id % 5) * 0.2;
            // Jeder Hydrant hat eigenen "Normalwert" → wichtig!

            // 1. Sanfter Drift zum individuellen Ziel
            const drift = (basePressure - h.currentPressure) * 0.05;

            // 2. Kleines Rauschen (immer aktiv)
            const noise = (Math.random() - 0.5) * 0.25;

            // 3. Events (machen es "lebendig")
            let event = 0;

            // 🔻 3% Chance: starker Druckabfall (z.B. Wasserentnahme / Leck)
            if (Math.random() < 0.03) {
                event -= Math.random() * 1.5; // -0 bis -1.5
            }

            // 🔺 2% Chance: kurzfristiger Druckanstieg (Pumpe / Reset)
            if (Math.random() < 0.02) {
                event += Math.random() * 1.0;
            }

            // 4. Neuer Wert
            let newValue = h.currentPressure + drift + noise + event;

            // 5. Soft Limits (realistisch, kein hartes Clamping)
            if (newValue < 2) newValue += 0.3;
            if (newValue > 4.8) newValue -= 0.2;

            // 6. Final Clamp
            newValue = Math.max(1.5, Math.min(4.8, newValue));

            // 7. Zeitlicher Faktor (tägliche Schwankungen simulieren)
            const timeFactor = Math.sin(Date.now() / 60000); // langsame Welle
            newValue += timeFactor * 0.1;

            // 8. Speichern
            h.currentPressure = parseFloat(newValue.toFixed(2));

            // 9. Status
            if (newValue < 2.5) h.status = 'CRITICAL';
            else if (newValue < 4.0) h.status = 'WARNING';
            else h.status = 'OK';

            await this.hydrantRepo.save(h);

            // 10. In Historie speichern
            const log = this.logRepo.create({ value: h.currentPressure, hydrant: h });
            await this.logRepo.save(log);
        }
        if (dataGenerationCount < 5) {
            //console.log(`📊 ${hydrants.length} neue Messwerte generiert.`);
            dataGenerationCount++;
        }
    }
}
