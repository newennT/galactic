import { Injectable } from '@angular/core';
import { Chapter } from '../../core/models/chapter.model';
import { Page } from '../../core/models/page.model';

@Injectable({ providedIn: 'root' })
export class ChapterNavigatorService {
  pageIndex = 0;

  next(chapter: Chapter): boolean {
    if (this.pageIndex < this.getLength(chapter) - 1) {
      this.pageIndex++;
      return true;
    }
    return false;
  }

  prev(): void {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  getLength(chapter: Chapter): number {
    return (chapter.Pages?.length ?? 0) + 2;
  }

  isContent(chapter: Chapter): boolean {
    return this.pageIndex > 0 && this.pageIndex <= (chapter.Pages?.length ?? 0);
  }

  isConclusion(chapter: Chapter): boolean {
    return this.pageIndex === (chapter.Pages?.length ?? 0) + 1;
  }

  currentPage(chapter: Chapter): Page | undefined {
    return chapter.Pages?.[this.pageIndex - 1];
  }

  reset(): void {
    this.pageIndex = 0;
  }
}