import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefBoardComponent } from './chef-board.component';

describe('ChefBoardComponent', () => {
  let component: ChefBoardComponent;
  let fixture: ComponentFixture<ChefBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChefBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
