import { HostListener, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexMainComponent } from './index-main/index-main.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion'; 
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

import {FileUploadModule} from 'primeng/fileupload';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BlockUIModule} from 'primeng/blockui';
import {MessageModule} from 'primeng/message';
import {PanelModule} from 'primeng/panel';
import {DividerModule} from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {FieldsetModule} from 'primeng/fieldset';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TimelineModule } from "primeng/timeline";
import {RadioButtonModule} from 'primeng/radiobutton';
import {ListboxModule} from 'primeng/listbox';
import {InputNumberModule} from 'primeng/inputnumber';

import { MintNftComponent } from './mint-nft/mint-nft.component';
import { LiquiditySwapComponent } from './liquidity-swap/liquidity-swap.component';
import { AddLiquidityPoolComponent } from './add-liquidity-pool/add-liquidity-pool.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexMainComponent,
    MintNftComponent,
    LiquiditySwapComponent,
    AddLiquidityPoolComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccordionModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DialogModule,
    FileUploadModule,
    CommonModule,
    HttpClientModule,
    ToastModule,
    ProgressSpinnerModule,
    BlockUIModule,
    MessageModule,
    PanelModule,
    DividerModule,
    ScrollPanelModule,
    FieldsetModule,
    DynamicDialogModule,
    TimelineModule,
    RadioButtonModule,
    ListboxModule,
    InputNumberModule
  ],
  providers: [HostListener],
  bootstrap: [AppComponent]
})
export class AppModule { }
