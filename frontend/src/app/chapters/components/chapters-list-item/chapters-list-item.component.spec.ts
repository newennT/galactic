import { ComponentFixture } from "@angular/core/testing";
import { ChaptersListItemComponent } from "./chapters-list-item.component";
import { RouterTestingModule } from "@angular/router/testing";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

describe('ChaptersListItemComponent', () => {
    let component: ChaptersListItemComponent;
    let fixture: ComponentFixture<ChaptersListItemComponent>;

    const mockChapter = {
        id_chapter: 12,
        order: 3,
        title: 'Titre en gallo',
        title_fr: 'Titre en français',
        abstract: 'Lorem ipsum blblbllblblbl',
        isPublished: true,
        id_level: 1,
        Level: {
            title: 'A1'
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChaptersListItemComponent],
            imports: [RouterTestingModule]
        }).compileComponents();
        fixture = TestBed.createComponent(ChaptersListItemComponent);
        component = fixture.componentInstance;
        component.chapter = mockChapter as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should receive chapter input', () => {
        expect(component.chapter).toEqual(mockChapter);
    });

    it('should display chapter level', () => {
        const levelElement = fixture.debugElement.query(By.css('.chapter-level')).nativeElement;
        expect(levelElement.textContent).toContain('A1');
    });

    it('should display chapter order', () => {
        const orderElement = fixture.debugElement.query(
            By.css('.order')
        ).nativeElement;

        expect(orderElement.textContent).toContain('Chapitre 3');
    });

    it('should display chapter title', () => {
        const titleElement = fixture.debugElement.query(
            By.css('.chapter-title h3')
        ).nativeElement;

        expect(titleElement.textContent).toContain('Titre en gallo');
    });

    it('should display chapter title in french', () => {
        const titleElement = fixture.debugElement.query(
            By.css('.chapter-title h4')
        ).nativeElement;

        expect(titleElement.textContent).toContain('Titre en français');
    });

    it('should have correct router link', () => {
        const linkDebugElement = fixture.debugElement.query(
            By.css('a')
        );

        expect(linkDebugElement.attributes['ng-reflect-router-link'])
            .toContain('12');
    });

    it('should render chapter card container', () => {
        const card = fixture.debugElement.query(
            By.css('.chapter-card')
        );

        expect(card).toBeTruthy();
    });


});