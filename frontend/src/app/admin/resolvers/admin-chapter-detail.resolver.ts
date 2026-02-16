import { inject } from "@angular/core";
import { ResolveFn, RouteConfigLoadEnd } from "@angular/router";
import { Chapter } from "src/app/core/models/chapter.model";
import { AdminChaptersService } from "../services/admin-chapters.service";


export const adminChapterDetailResolver: ResolveFn<Chapter> = (route) => {
    const id = Number(route.paramMap.get('id'));
    return inject(AdminChaptersService).getChapterById(id);
}