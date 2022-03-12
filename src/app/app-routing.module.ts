import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexMainComponent } from './index-main/index-main.component';

const routes: Routes = [
  {path:'index',component:IndexMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
