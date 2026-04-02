import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Hydrant } from './hydrant.entity';

/**
 * Speichert einen einzelnen Druck-Messwert eines Hydranten.
 */
@Entity('pressure_logs')
export class PressureLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    value: number; // Der Druck in Bar (z.B. 4.52)

    @CreateDateColumn({ type: 'timestamptz' })
    timestamp: Date; // Wann wurde gemessen?

    @ManyToOne(() => Hydrant, (hydrant) => hydrant.logs)
    hydrant: Hydrant; // Zu welchem Hydranten gehört der Wert?
}
