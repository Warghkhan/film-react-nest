//TODO описать DTO для запросов к /films
export class FilmDto {
  id: string;
  title: string;
  director: string;
  rating: number;
  tags: string[];
  about: string;
  description: string;
  image: string;
  cover: string;
}
