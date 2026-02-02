import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.scss']
})
export class ChapterDetailComponent {
  chapter$ = this.route.data.pipe(
    map(data => data['chapter'])
  );

  constructor(private route: ActivatedRoute) {  }

}
