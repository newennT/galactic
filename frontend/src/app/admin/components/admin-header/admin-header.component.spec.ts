import { ComponentFixture } from "@angular/core/testing";
import { AdminHeaderComponent } from "./admin-header.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "src/app/core/services/auth.service";
import { TestBed } from "@angular/core/testing";

describe('AdminHeaderComponent', () => {
    let component: AdminHeaderComponent;
    let fixture: ComponentFixture<AdminHeaderComponent>;

    const authServiceMock = {
        logout: jest.fn(),
        isLogged: jest.fn().mockReturnValue(true)
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminHeaderComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AdminHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call auth.logout when logout is called', () => {
        component.logout();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });
});