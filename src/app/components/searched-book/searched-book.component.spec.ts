import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedBookComponent } from './searched-book.component';

describe('SearchedBookComponent', () => {
  let component: SearchedBookComponent;
  let fixture: ComponentFixture<SearchedBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchedBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchedBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
