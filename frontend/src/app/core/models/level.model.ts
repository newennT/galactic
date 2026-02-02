import { Chapter } from "./chapter.model";

export class Level {
    id_level!: number;
    title!: string;

    Chapters!: Chapter[];
}