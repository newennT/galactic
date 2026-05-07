import { ComponentFixture } from "@angular/core/testing";
import { AdminListChaptersItemComponent } from "./admin-list-chapters-item.component";
import { TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";

describe('AdminListChaptersItemComponent', () => {
    let component: AdminListChaptersItemComponent;
    let fixture: ComponentFixture<AdminListChaptersItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminListChaptersItemComponent],
            imports: [RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(AdminListChaptersItemComponent);
        component = fixture.componentInstance;

        component.adminChapter = {
            id_chapter: 1,
            title: "Titre test",
            order: 1
        } as any;

        component.reorderMode = false;
        component.index = 2;

        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit moveUpEvent with index', () => {
        const spy = jest.spyOn(component.moveUpEvent, 'emit');
        component.moveUp();
        expect(spy).toHaveBeenCalledWith(2);
    });

    it('should emit moveDownEvent with index', () => {
        const spy = jest.spyOn(component.moveDownEvent, 'emit');
        component.moveDown();
        expect(spy).toHaveBeenCalledWith(2);
    });

    it('should initialize inputs correctly', () => {
        expect(component.adminChapter.id_chapter).toBe(1);
        expect(component.reorderMode).toBe(false);
        expect(component.index).toBe(2);
    });
});