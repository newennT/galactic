import { ComponentFixture } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";
import { UserChapterService } from "../../services/userChapter.service";
import { AuthService } from "src/app/core/services/auth.service";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const userChapterServiceMock = {
        getUserChapters: jest.fn()
    };

    const authServiceMock = {
        isLogged: jest.fn(),
        logout: jest.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            providers: [
                { provide: UserChapterService, useValue: userChapterServiceMock },
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load chapters and user on init', () => {
        const mockResponse = {
            chapters: [
                {
                    id_chapter: 1,
                    title: 'Chapter 1',
                    content: 'Content of chapter 1',
                },
                {
                    id_chapter: 2,
                    title: 'Chapter 2',
                    content: 'Content of chapter 2',
                }
            ],
            user: {
                id_user: 1, username: 'testuser'
            }
        };

        userChapterServiceMock.getUserChapters.mockReturnValue(of(mockResponse));

        component.ngOnInit();

        expect(component.chapters).toEqual(mockResponse.chapters);
        expect(component.user).toEqual(mockResponse.user);
        expect(component.loading).toBe(false);
    });

    it('should handle error and stop loading', () => {
        userChapterServiceMock.getUserChapters.mockReturnValue(
            throwError(() => new Error('API Error'))
        );
        
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        component.ngOnInit();
        expect(component.loading).toBe(false);  
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should initialize loading to true', () => {
        expect(component.loading).toBe(true);
    });

    it('should expose icons', () => {
        expect(component.faPlay).toBeDefined();
        expect(component.faCircle).toBeDefined();
    });
});