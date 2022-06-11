import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexMainComponent } from './index-main/index-main.component';
import { LiquidityPoolComponent } from './liquidity-pool/liquidity-pool.component';
import { MintNftComponent } from './mint-nft/mint-nft.component';
import { AuthGuard } from "./shared/auth.guard";

const routes: Routes = [
  {path:'index',component:IndexMainComponent
  },
  {path:'mint-nft',component:MintNftComponent},
  {path:'liquidity-pool',component:LiquidityPoolComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
