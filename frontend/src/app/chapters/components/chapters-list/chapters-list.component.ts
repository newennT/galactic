import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Chapter } from 'src/app/core/models/chapter.model';
import { ChaptersService } from 'src/app/chapters/services/chapters.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chapters-list',
  templateUrl: './chapters-list.component.html',
  styleUrls: ['./chapters-list.component.scss']
})
export class ChaptersListComponent implements OnInit{

  chapters$!: Observable<Chapter[]>;

  constructor(private route: ActivatedRoute, private chaptersService: ChaptersService) {  }


  ngOnInit(): void {
    this.chapters$ = this.route.data.pipe(
      map(data => data['chapters'])
      
    );

  }

}
