import { ChapterExerciseYoutubeService } from './chapterExerciseYoutube.service';


describe('YoutubeService', () => {
  let chapterExerciseYoutubeService: ChapterExerciseYoutubeService;
  const sanitizerMock = {
    bypassSecurityTrustResourceUrl: jest.fn((url) => url)
  };

  beforeEach(() => {
    chapterExerciseYoutubeService = new ChapterExerciseYoutubeService(sanitizerMock as any);
    jest.clearAllMocks();
  });


  it('should extract id from youtube long url', () => {
    const url = 'https://www.youtube.com/watch?v=abc123';
    expect(chapterExerciseYoutubeService.getYoutubeId(url)).toBe('abc123');
  });

  it('should extract id from short url', () => {
    const url = 'https://youtu.be/xyz789';
    expect(chapterExerciseYoutubeService.getYoutubeId(url)).toBe('xyz789');
  });

  it('should return null for invalid url', () => {
    expect(chapterExerciseYoutubeService.getYoutubeId('invalid')).toBeNull();
  });

  it('should return null for empty url', () => {
    expect(chapterExerciseYoutubeService.getYoutubeId('')).toBeNull();
  });


  it('should generate embed url for valid youtube link', () => {
    const url = 'https://www.youtube.com/watch?v=abc123';
    const result = chapterExerciseYoutubeService.getEmbedUrl(url);
    expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('https://www.youtube.com/embed/abc123?autoplay=1');

    expect(result).toBe('https://www.youtube.com/embed/abc123?autoplay=1');
  });

  it('should return safe empty url for invalid input', () => {
    const result = chapterExerciseYoutubeService.getEmbedUrl('invalid');
    expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('');
  });

});