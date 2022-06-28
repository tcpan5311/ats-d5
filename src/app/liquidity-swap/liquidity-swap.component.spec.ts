import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquiditySwapComponent } from './liquidity-swap.component';

describe('LiquidityPoolComponent', () => {
  let component: LiquiditySwapComponent;
  let fixture: ComponentFixture<LiquiditySwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquiditySwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquiditySwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
