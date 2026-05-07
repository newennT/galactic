import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminListChaptersComponent } from "./admin-list-chapters.component";
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { AdminChaptersService } from "../../services/admin-chapters.service";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { RouterTestingModule } from "@angular/router/testing";


describe('AdminListChaptersComponent', () => {
    let component: AdminListChaptersComponent;
    let fixture: ComponentFixture<AdminListChaptersComponent>;

    const getMockChapters = () => ([
        {
            id_chapter: 2,
            order: 1
        },
        {
            id_chapter: 1,
            order: 2
        },
        {
            id_chapter: 3,
            order: 3
        }
    ]);
    

    const adminChaptersServiceMock = {
        reorder: jest.fn()
    };

    beforeEach(async() => {
        const activatedRouteMock = {
            data: of({ adminChapters: getMockChapters() })
        };
        await TestBed.configureTestingModule({
            declarations: [AdminListChaptersComponent],
            imports: [DragDropModule, RouterTestingModule],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: AdminChaptersService, useValue: adminChaptersServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminListChaptersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize and sort chapters by order', () => {
        expect(component.chapters[0].id_chapter).toBe(2);
        expect(component.chapters[1].id_chapter).toBe(1);
        expect(component.chapters[2].id_chapter).toBe(3);
    });

    it('should toggle reorder mode', () => {
        expect(component.reorderMode).toBe(false);
        component.toggleReorderMode();
        expect(component.reorderMode).toBe(true);
        component.toggleReorderMode();
        expect(component.reorderMode).toBe(false);
    });

    it('should reorder chapters on drop', () => {
        component.drop({
            previousIndex: 0,
            currentIndex: 1
        } as any);

        expect(component.chapters[0].id_chapter).toBe(1);
        expect(component.chapters[1].id_chapter).toBe(2);
        expect(component.chapters[0].order).toBe(1);
        expect(component.chapters[1].order).toBe(2);
    });

    it('should move chapter up', () => {
        component.moveUp(1);

        expect(component.chapters[0].id_chapter).toBe(1);
        expect(component.chapters[1].id_chapter).toBe(2);

        expect(component.chapters[0].order).toBe(1);
        expect(component.chapters[1].order).toBe(2);
    });

    it('should not move chapter up when index is 0', () => {
        const initialChapters = [...component.chapters];
        component.moveUp(0);
        expect(component.chapters).toEqual(initialChapters);
    });

    it('should move chapter down', () => {
        component.moveDown(0);
        expect(component.chapters[0].id_chapter).toBe(1);
        expect(component.chapters[1].id_chapter).toBe(2);
        expect(component.chapters[0].order).toBe(1);
        expect(component.chapters[1].order).toBe(2);
    });

    it('should not move chapter down when index is last', () => {
        const initialChapters = [...component.chapters];
        component.moveDown(component.chapters.length - 1);
        expect(component.chapters).toEqual(initialChapters);
    });

    it('should update orders', () => {
        component.chapters = [
            { id_chapter: 10 } as any,
            { id_chapter: 20 } as any,
            { id_chapter: 30 } as any
        ];
        component.updateOrders();
        expect(component.chapters[0].order).toBe(1);
        expect(component.chapters[1].order).toBe(2);
        expect(component.chapters[2].order).toBe(3);
    });

    it('should save order and disable reorder mode on success', () => {
        adminChaptersServiceMock.reorder.mockReturnValue(of({}));
        component.reorderMode = true;
        component.saveOrder();
        expect(adminChaptersServiceMock.reorder).toHaveBeenCalledWith([
            { id_chapter: 2, order: 1 },
            { id_chapter: 1, order: 2 },
            { id_chapter: 3, order: 3 }
        ]);
        expect(component.reorderMode).toBe(false);
    });

    it('should handle reorder error', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        adminChaptersServiceMock.reorder.mockReturnValue(throwError(() => 'Erreur'));
        component.saveOrder();
        expect(consoleSpy).toHaveBeenCalledWith('Erreur');
        consoleSpy.mockRestore();
    });
});