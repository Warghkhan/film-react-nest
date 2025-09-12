import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './schedule.schema';

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  director: string;

  @Prop()
  rating: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  image: string; // например: "/bg1s.jpg"

  @Prop()
  cover: string;

  @Prop()
  about: string;

  @Prop()
  description: string;

  @Prop(() => [ScheduleSchema])
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
