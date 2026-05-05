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

  const contentLength = mockPages.length;

  beforeEach(() => {
    service = new ChapterNavigatorService();
  });

  afterEach(() => {
    service.reset();
  });

  describe('navigation', () => {

    it('should increment pageIndex and return true', () => {
      const result = service.next(mockChapter);

      expect(result).toBe(true);
      expect(service.pageIndex).toBe(1);
    });

    it('should return false when reaching end', () => {
      service.pageIndex = service.getLength(mockChapter) - 1;

      const result = service.next(mockChapter);

      expect(result).toBe(false);
      expect(service.pageIndex).toBe(service.getLength(mockChapter) - 1);
    });

    it('should decrement pageIndex but not below 0', () => {
      service.pageIndex = 1;
      service.prev();
      expect(service.pageIndex).toBe(0);

      service.prev();
      expect(service.pageIndex).toBe(0);
    });

    it('should compute correct virtual length', () => {
      expect(service.getLength(mockChapter)).toBe(contentLength + 2);
    });

    it('should compute fallback length when no pages', () => {
      const empty = { Pages: undefined } as Chapter;
      expect(service.getLength(empty)).toBe(2);
    });

  });

  describe('isContent', () => {

    it('should be false for intro page (0)', () => {
      service.pageIndex = 0;
      expect(service.isContent(mockChapter)).toBe(false);
    });

    it('should be true for first content page', () => {
      service.pageIndex = 1;
      expect(service.isContent(mockChapter)).toBe(true);
    });

    it('should be true for last content page', () => {
      service.pageIndex = contentLength;
      expect(service.isContent(mockChapter)).toBe(true);
    });

    it('should be false for conclusion page', () => {
      service.pageIndex = contentLength + 1;
      expect(service.isContent(mockChapter)).toBe(false);
    });

    it('should return false when chapter has no pages (isContent)', () => {
      service.pageIndex = 1;
      const emptyChapter = { Pages: [] } as any;
      expect(service.isContent(emptyChapter)).toBe(false);
    });

    it('should return false when pageIndex exceeds length (isContent)', () => {
      const chapter = { Pages: mockPages } as any;
      service.pageIndex = mockPages.length + 1;
      expect(service.isContent(chapter)).toBe(false);
    });

    it('should return true when pageIndex equals length (isContent)', () => {
      const chapter = { Pages: mockPages } as any;
      service.pageIndex = mockPages.length;
      expect(service.isContent(chapter)).toBe(true);
    });

  });

  describe('isConclusion', () => {

    it('should be false before conclusion', () => {
      service.pageIndex = contentLength;
      expect(service.isConclusion(mockChapter)).toBe(false);
    });

    it('should be true on conclusion page', () => {
      service.pageIndex = contentLength + 1;
      expect(service.isConclusion(mockChapter)).toBe(true);
    });

    it('should be false after conclusion', () => {
      service.pageIndex = contentLength + 2;
      expect(service.isConclusion(mockChapter)).toBe(false);
    });

    it('should return false when not on conclusion page (isConclusion)', () => {
      const chapter = { Pages: mockPages } as any;
      service.pageIndex = mockPages.length;
      expect(service.isConclusion(chapter)).toBe(false);
    });

    it('should handle undefined pages in isContent and isConclusion', () => {
      const chapter = { Pages: undefined } as any;
      service.pageIndex = 1;
      expect(service.isContent(chapter)).toBe(false);
      expect(service.isConclusion(chapter)).toBe(false);
    });

  });

  describe('currentPage', () => {

    it('should return correct page', () => {
      service.pageIndex = 2;
      expect(service.currentPage(mockChapter)).toEqual(mockPages[1]);
    });

    it('should return undefined for intro page', () => {
      service.pageIndex = 0;
      expect(service.currentPage(mockChapter)).toBeUndefined();
    });

  });

  describe('reset', () => {

    it('should reset pageIndex to 0', () => {
      service.pageIndex = 5;
      service.reset();
      expect(service.pageIndex).toBe(0);
    });

  });

});