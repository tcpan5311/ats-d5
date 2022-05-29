import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../app/shared/auth.service';

@Component({
  selector: 'app-mint-nft',
  templateUrl: './mint-nft.component.html',
  styleUrls: ['./mint-nft.component.scss']
})
export class MintNftComponent implements OnInit {

  constructor(private as:AuthService) { }

  ngOnInit(): void {

    console.log(this.as.verifyConnectWallet())

  }

}
