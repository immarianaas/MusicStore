import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPathExceptionComponent } from './no-path-exception.component';

describe('NoPathExceptionComponent', () => {
  let component: NoPathExceptionComponent;
  let fixture: ComponentFixture<NoPathExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPathExceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPathExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
