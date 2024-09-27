import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublisherComponent } from './add-publisher.component';

describe('AddPublisherComponent', () => {
  let component: AddPublisherComponent;
  let fixture: ComponentFixture<AddPublisherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPublisherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
