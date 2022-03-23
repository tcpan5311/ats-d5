import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexMainComponent } from './index-main/index-main.component';
import { AuthGuard } from "./shared/auth.guard";

const routes: Routes = [
  {path:'index',component:IndexMainComponent
  // ,canActivate:[AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
