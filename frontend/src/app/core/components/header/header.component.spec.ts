import { ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const authServiceMock = {
        logout: jest.fn(),
        isLogged: jest.fn(),
        isAdmin: jest.fn()
    };
    const routerMock = {
        navigate: jest.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [
                MatToolbarModule,
                NoopAnimationsModule,
                MatSidenavModule,
                MatListModule,
                FontAwesomeModule,
                RouterTestingModule
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call auth.logout on logout', () => {
        component.logout();
        expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('should expose icons', () => {
        expect(component.faHouse).toBeDefined();
        expect(component.faBars).toBeDefined();
    });
});