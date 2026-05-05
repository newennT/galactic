import { ChapterNavigatorService } from './chapterNavigator.service';
import { Chapter } from '../../core/models/chapter.model';
import { Page } from '../../core/models/page.model';

describe('ChapterNavigatorService', () => {

  let service: ChapterNavigatorService;

  const mockPages: Page[] = [
    { id_page: 1 } as Page,
    { id_page: 2 } as Page,
    { id_page: 3 } as Page
  ];

  const mockChapter: Chapter = {
    id_chapter: 1,
    Pages: mockPages
  } as Chapter;

  beforeEach(() => {
    service = new ChapterNavigatorService();
  });

  afterEach(() => {
    service.reset();
  });

  describe('next', () => {

    it('should increment pageIndex and return true', () => {

      const result = service.next(mockChapter);

      expect(result).toBe(true);
      expect(service.pageIndex).toBe(1);
    });

    it('should return false if already at last page', () => {

      service.pageIndex = service.getLength(mockChapter) - 1;

      const result = service.next(mockChapter);

      expect(result).toBe(false);

      expect(service.pageIndex)
        .toBe(service.getLength(mockChapter) - 1);
    });
  });

  describe('prev', () => {

    it('should decrement pageIndex', () => {

      service.pageIndex = 2;

      service.prev();

      expect(service.pageIndex).toBe(1);
    });

    it('should not decrement below 0', () => {

      service.pageIndex = 0;

      service.prev();

      expect(service.pageIndex).toBe(0);
    });
  });

  describe('getLength', () => {

    it('should return pages length + 2', () => {

      const length = service.getLength(mockChapter);

      expect(length).toBe(5);
    });

    it('should return 2 if chapter has no pages', () => {

      const emptyChapter = {
        Pages: undefined
      } as Chapter;

      const length = service.getLength(emptyChapter);

      expect(length).toBe(2);
    });
  });

  describe('isContent', () => {

    it('should return true for content pages', () => {

      service.pageIndex = 1;

      expect(service.isContent(mockChapter))
        .toBe(true);
    });

    it('should return false for intro page', () => {

      service.pageIndex = 0;

      expect(service.isContent(mockChapter))
        .toBe(false);
    });

    it('should return false for conclusion page', () => {

      service.pageIndex = 4;

      expect(service.isContent(mockChapter))
        .toBe(false);
    });
  });

  describe('isConclusion', () => {

    it('should return true for conclusion page', () => {

      service.pageIndex = 4;

      expect(service.isConclusion(mockChapter))
        .toBe(true);
    });

    it('should return false otherwise', () => {

      service.pageIndex = 2;

      expect(service.isConclusion(mockChapter))
        .toBe(false);
    });
  });

  describe('currentPage', () => {

    it('should return the current page', () => {

      service.pageIndex = 2;

      const result = service.currentPage(mockChapter);

      expect(result).toEqual(mockPages[1]);
    });

    it('should return undefined for intro page', () => {

      service.pageIndex = 0;

      const result = service.currentPage(mockChapter);

      expect(result).toBeUndefined();
    });
  });

  describe('reset', () => {

    it('should reset pageIndex to 0', () => {

      service.pageIndex = 3;

      service.reset();

      expect(service.pageIndex).toBe(0);
    });
  });
});