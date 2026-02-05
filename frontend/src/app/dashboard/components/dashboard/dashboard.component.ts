import { Component, OnInit } from '@angular/core';
import { UserChapter,UserChapterService } from '../../services/userChapter.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  chapters: UserChapter[] = [];
  loading = true;

  constructor(private userChapterService: UserChapterService) { }
  ngOnInit(): void {
    this.userChapterService.getUserChapters().subscribe({

      next: (data) => {
        this.chapters = data.chapters;
        this.loading = false;
        console.log('Chapitres', this.chapters);
      },
      error: (err) => {
        console.log('Erreur récupération chapitres', err);
        this.loading = false;
      }
    });
  }

}
