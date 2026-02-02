import { inject } from "@angular/core";
import { ResolveFn, RouteConfigLoadEnd } from "@angular/router";
import { Chapter } from "src/app/core/models/chapter.model";
import { ChaptersService } from "../services/chapters.service";

export const chapterDetailResolver: ResolveFn<Chapter> = (route) => {
    const id = Number(route.paramMap.get('id'));
    return inject(ChaptersService).getChapterById(id);
}