import { Controller, Get, Param, ParseIntPipe, Post, Delete, Patch, Body } from '@nestjs/common';
import { HydrantsService } from './hydrants.service';

/**
 * API-Endpunkte für Hydranten-Daten.
 */

@Controller('hydrants')
export class HydrantsController {
    constructor(private hydrantsService: HydrantsService) { }

    /**
     * GET /hydrants
     * Holt liste aller Hydranten für die Karte.
     * Jeder Hydrant enthält auch den aktuellen Druckwert (live data).
     * @return Eine Liste aller Hydranten mit ihren aktuellen Druckwerten
     * Wichtig: Wir nutzen withCredentials, damit die Cookies (Session) mitgesendet werden  
     */
    @Get()
    async getAllHydrants() {
        return this.hydrantsService.findAllWithLivePressure();
    }

    /**
     * GET /hydrants/:id/logs
     * Holt die letzten Messwerte eines Hydranten für Highcharts. 
     * @param id Die ID des Hydranten
     * @return Eine Liste der letzten Messwerte des Hydranten
     */
    @Get(':id/logs')
    async getLogs(@Param('id', ParseIntPipe) id: number) {
        return this.hydrantsService.getPressureLogs(id);
    }

    /**
     * POST /hydrants/:id/leak
     * Simuliert ein Leck, indem der Druck eines Hydranten massiv gesenkt wird.   
     * @param id Die ID des Hydranten, bei dem das Leck simuliert werden soll
     * @returns Eine Erfolgsmeldung oder Fehlermeldung
     */
    @Post(':id/leak')
    async triggerLeak(@Param('id', ParseIntPipe) id: number) {
        return this.hydrantsService.simulateLeak(id);
    }


    /**
     * POST /hydrants/:id/repair
     * Endpunkt zum Reparieren eines Hydranten.
     * Setzt den aktuellen Druckwert des Hydranten über den Service wieder 
     * auf seinen definierten Basiswert zurück.
     * @param {number} id - Die eindeutige ID des zu reparierenden Hydranten.
     * @returns {Promise<any>} Das Ergebnis der Reparaturoperation vom Service.
     */
    @Post(':id/repair')
    async repairHydrant(@Param('id', ParseIntPipe) id: number) {
        return this.hydrantsService.repairHydrant(id);
    }

    /**
     * Endpunkt zum Erstellen eines neuen Hydranten.
     * Nimmt die Hydranten-Daten aus dem Request-Body entgegen und
     * leitet diese an den Service zur Speicherung in der Datenbank weiter.
     * 
     * @param {any} data - Das Objekt mit den Hydranten-Daten (z. B. Name, Koordinaten, Basisdruck).
     * @returns {Promise<any>} Das neu erstellte Hydranten-Objekt inklusive generierter ID.
     */
    @Post()
    async create(@Body() data: any) {
        return this.hydrantsService.create(data);
    }

    /**
     * Endpunkt zum partiellen Aktualisieren eines bestehenden Hydranten.
     * Nimmt die zu ändernden Daten aus dem Request-Body entgegen und 
     * aktualisiert gezielt die Felder des durch die ID spezifizierten Hydranten.
     * 
     * @param {number} id - Die eindeutige ID des zu aktualisierenden Hydranten.
     * @param {any} data - Ein Objekt mit den geänderten Attributen (z. B. Status, Position).
     * @returns {Promise<any>} Das aktualisierte Hydranten-Objekt vom Service.
     */
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.hydrantsService.update(id, data);
    }

    /**
     * Endpunkt zum Löschen eines Hydranten aus dem System.
     * Entfernt den Datensatz mit der angegebenen ID dauerhaft aus der Datenbank.
     * 
     * @param {number} id - Die eindeutige ID des zu löschenden Hydranten.
     * @returns {Promise<any>} Das Ergebnis des Löschvorgangs vom Service.
     */
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.hydrantsService.remove(id);
    }


}
