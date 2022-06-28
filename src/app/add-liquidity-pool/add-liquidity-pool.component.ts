import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import {DialogService} from 'primeng/dynamicdialog';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-add-liquidity-pool',
  templateUrl: './add-liquidity-pool.component.html',
  styleUrls: ['./add-liquidity-pool.component.scss'],
  providers: [DialogService,MessageService]
})
export class AddLiquidityPoolComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
