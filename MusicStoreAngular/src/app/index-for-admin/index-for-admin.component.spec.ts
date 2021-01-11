import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexForAdminComponent } from './index-for-admin.component';

describe('IndexForAdminComponent', () => {
  let component: IndexForAdminComponent;
  let fixture: ComponentFixture<IndexForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexForAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
