import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuthorComponent } from './add-author.component';

describe('AddAuthorComponent', () => {
  let component: AddAuthorComponent;
  let fixture: ComponentFixture<AddAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAuthorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
