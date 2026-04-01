import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Der Haupt-Controller der Anwendung.
 * Dient als Einstiegspunkt und stellt grundlegende Informationen 
 * über den Status des Backends bereit.
 */
@Controller()
export class AppController {
  /**
   * Initialisiert den AppController mit dem AppService.
   * 
   * @param {AppService} appService - Service für allgemeine Anwendungslogik.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Standard-Endpunkt (Root), um die Erreichbarkeit des Backends zu prüfen.
   * 
   * @returns {string} Eine einfache Begrüßungsnachricht oder Statusmeldung.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
