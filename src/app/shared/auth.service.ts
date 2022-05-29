import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import crypto from "crypto-ES";
import { Cipher, CipherCCMTypes } from 'crypto';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  decrypt_keystore_1: string = ''

  constructor(private HttpClient: HttpClient, public Router: Router) { }

  saveToken(keystore:any)
  {
    sessionStorage.removeItem('key')
    keystore = crypto.AES.encrypt(JSON.stringify(keystore),'MyDreamCarGTR35')
    sessionStorage.setItem('key',keystore.toString())
  }

  getToken() 
  {
    const key = sessionStorage.getItem('key')

    if(key != undefined)
    {
      const decrypt_keystore = crypto.AES.decrypt(key!, 'MyDreamCarGTR35');
      const decrypt_keystore_obj = JSON.parse(decrypt_keystore.toString(crypto.enc.Utf8));
  
      return decrypt_keystore_obj
    }

  }

  verifyConnectWallet()
  {
    if(this.getToken() != undefined)
    {
      return true
    }

    else
    {
      return false
    }
  } 

  //Shared function for wallet interaction
  private ConnectWalletCallSource = new Subject<any>();
  ConnectWalletMethodCalled$ = this.ConnectWalletCallSource.asObservable();

  callConnectWalletMethod() {
    this.ConnectWalletCallSource.next();
  }

  private DisconnectWalletCallSource = new Subject<any>();
  DisconnectWalletMethodCalled$ = this.DisconnectWalletCallSource.asObservable();

  callDisconnectWalletMethod()
  {
    this.DisconnectWalletCallSource.next()
  }

  private ReadBalanceCallSource = new Subject<any>();
  ReadBalanceMethodCalled$ = this.ReadBalanceCallSource.asObservable();

  callReadBalanceMethod()
  {
    this.ReadBalanceCallSource.next()
  }

}
