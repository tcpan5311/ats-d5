import { Component, OnInit } from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-liquidity-pool',
  templateUrl: './liquidity-pool.component.html',
  styleUrls: ['./liquidity-pool.component.scss']
})
export class LiquidityPoolComponent implements OnInit {

  selectTokenModal: any

  tokens: any = []
  selectedToken: any

  constructor() { }

  ngOnInit(): void 
  {

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

  launchSelectTokenModal()
  {
    this.selectTokenModal = true
  }

}
