import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import {DialogService} from 'primeng/dynamicdialog';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-liquidity-swap',
  templateUrl: './liquidity-swap.component.html',
  styleUrls: ['./liquidity-swap.component.scss'],
  providers: [DialogService,MessageService]
})
export class LiquiditySwapComponent implements OnInit {

  selectTokenModal: any

  tokens: any = []
  selectedToken: any

  LPFormGroup !: FormGroup

  constructor() { }

  ngOnInit(): void 
  {
    
    function LPFormInputValidator(control: AbstractControl): { [key: string]: boolean } | null
    {
      
      if(control.value == null)
      {
        return {"nullInput" : true };
      }

      else if(control.value <=0)
      {
        return {"invalidInput" : true };
      }

      return null
    }

    this.LPFormGroup = new FormGroup 
    ({
        inputFirst:  new FormControl(null, [LPFormInputValidator]),
        inputSecond:  new FormControl(null, [LPFormInputValidator]),
    });
    
    this.tokens = [
      { name: "Ethereum", code: "ETH" },
      { name: "Wrapped Bitcoin", code: "WBTC" },
      { name: "Cardano", code: "ADA" },
      { name: "Avalanche", code: "AVAX" },
      { name: "Solana", code: "SOL" },
      { name: "Polygon", code: "MATIC" },
      { name: "Polkadot", code: "DOT" },
      { name: "Litecoin", code: "LRC" },
    ];

  }

  get f()
  {
      return this.LPFormGroup.controls;
  }

  launchSelectTokenModal()
  {
    this.selectTokenModal = true
  }

  confirmSwapModal()
  {
    console.log("Swap successful")
  }

}
