import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLiquidityPoolComponent } from './add-liquidity-pool.component';

describe('AddLiquidityPoolComponent', () => {
  let component: AddLiquidityPoolComponent;
  let fixture: ComponentFixture<AddLiquidityPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLiquidityPoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLiquidityPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
