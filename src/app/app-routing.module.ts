import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexMainComponent } from './index-main/index-main.component';
import { LiquiditySwapComponent } from './liquidity-swap/liquidity-swap.component';
import { AddLiquidityPoolComponent } from './add-liquidity-pool/add-liquidity-pool.component';
import { MintNftComponent } from './mint-nft/mint-nft.component';
import { AuthGuard } from "./shared/auth.guard";

const routes: Routes = [
  {path:'index',component:IndexMainComponent},
  {path:'liquidity-swap',component:LiquiditySwapComponent},
  {path:'add-liquidity',component:AddLiquidityPoolComponent},
  {path:'mint-nft',component:MintNftComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
