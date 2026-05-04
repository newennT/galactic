import { ComponentFixture } from "@angular/core/testing";
import { ChaptersListComponent } from "./chapters-list.component";
import { of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ChaptersService } from "../../services/chapters.service";
import { TestBed } from "@angular/core/testing";
import { Component, Input } from "@angular/core";
import { Chapter } from "src/app/core/models/chapter.model";
import { By } from "@angular/platform-browser";

/**
 * Mock du composant enfant
 * pour éviter NG0304 / NG0303
 */
@Component({
  selector: 'app-chapters-list-item',
  template: ''
})
class MockChaptersListItemComponent {
  @Input() chapter!: Chapter;
}

describe('ChaptersListComponent', () => {
    let component: ChaptersListComponent;
    let fixture: ComponentFixture<ChaptersListComponent>;

    const mockChapters = [
        { id: 1, title: 'Chapter 1' },
        { id: 2, title: 'Chapter 2' },
        { id: 3, title: 'Chapter 3' }
    ];

    const activatedRouteMock = {
        data: of({
            chapters: mockChapters
        })
    };

    const chaptersServiceMock = {
        getChapters: jest.fn(() => of(mockChapters))
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChaptersListComponent, MockChaptersListItemComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: ChaptersService, useValue: chaptersServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ChaptersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize chapters from route data', (done) => {
        fixture.detectChanges();
        component.chapters$.subscribe(chapters => {
            expect(chapters).toEqual(mockChapters);
            done();
        });
    });

    it('should render a list of chapter items', () => {
        fixture.detectChanges();
        const items = fixture.debugElement.queryAll(
            By.directive(MockChaptersListItemComponent)
        )
        expect(items.length).toBe(3);
    });
});