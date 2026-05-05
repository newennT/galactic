import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private sanitizer: DomSanitizer) {}

  getYoutubeId(url: string): string | null {
    const regExp = /(?:youtube\.com.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);

    return match ? match[1] : null;
  }

  getEmbedUrl(url: string): SafeResourceUrl {
    const videoId = this.getYoutubeId(url);

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?autoplay=1`
    );
  }
}