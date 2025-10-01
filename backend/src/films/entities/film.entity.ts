import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  director: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Schedule, schedule => schedule.film, { cascade: true })
  schedule: Schedule[];
}