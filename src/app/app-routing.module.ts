import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexMainComponent } from './index-main/index-main.component';
import { MintNftComponent } from './mint-nft/mint-nft.component';
import { AuthGuard } from "./shared/auth.guard";

const routes: Routes = [
  {path:'index',component:IndexMainComponent
  // ,canActivate:[AuthGuard]
  },
  {path:'mint-nft',component:MintNftComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
