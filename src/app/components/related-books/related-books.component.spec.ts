import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedBooksComponent } from './related-books.component';

describe('RelatedBooksComponent', () => {
  let component: RelatedBooksComponent;
  let fixture: ComponentFixture<RelatedBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
