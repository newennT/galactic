import { ResolveFn } from "@angular/router";
import { Chapter } from "src/app/core/models/chapter.model";
import { ChaptersService } from "../services/chapters.service";
import { inject } from "@angular/core";

export const chaptersResolver: ResolveFn<Chapter[]> = () => {
    const chaptersService = inject(ChaptersService);
    return chaptersService.getChapters();
};