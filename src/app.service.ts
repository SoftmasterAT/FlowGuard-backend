import { Injectable } from '@nestjs/common';

/**
 * Basis-Service der Anwendung.
 * Stellt einfache Hilfsfunktionen und Statusmeldungen für den 
 * Haupt-Controller (AppController) bereit.
 * 
 * @class AppService
 */
@Injectable()
export class AppService {

   /**
   * Liefert eine einfache Grußbotschaft zurück.
   * Dient primär als Smoke-Test, um sicherzustellen, dass der 
   * Service-Injektor korrekt arbeitet.
   * 
   * @returns {string} Die Zeichenfolge 'Hello World!'.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
