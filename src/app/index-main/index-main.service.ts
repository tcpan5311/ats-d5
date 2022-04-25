import { Injectable } from '@angular/core';
import abi from '../../lib/Transactions.json'
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndexMainService {

  private fetchGasFeeUrl =  'http://localhost:3000/getGasFee'
  private saveTransactionHistoryUrl = 'http://localhost:3000/api/transactions'
  private saveNewUserAddressUrl = 'http://localhost:3000/api/users'
  private getTransactionHistoryUrl = 'http://localhost:3000/api/retriveTxHistory'
  response:any

  constructor(private HttpClient: HttpClient) { }

  getContractABI()
  {
    return abi.abi
  }

  getContractAddress()
  {
    return '0x26b28eA48c8aEF1E3A83e141891f5b3df93F5717'
  }

  getGasFee()
  {
    this.response = this.HttpClient.get(this.fetchGasFeeUrl).toPromise()

    return new Promise((resolve,reject)=>{

      Promise.all([this.response]).then(([r])=>{

        const gasLimit = 100000
        const lowGasPricePerUnit = Number(r.low)
        const avgGasPricePerUnit = Number(r.average)
        const highGasPricePerUnit = Number(r.high)

        let totalLowGas = (gasLimit * lowGasPricePerUnit) * 10 ** -9
        totalLowGas =  Math.round(totalLowGas * 1000000 + Number.EPSILON)/1000000
        
        let totalAvgGas = (gasLimit * avgGasPricePerUnit) * 10 ** -9
        totalAvgGas = Math.round(totalAvgGas * 1000000 + Number.EPSILON)/1000000

        let totalHighGas = (gasLimit * highGasPricePerUnit) * 10 ** -9
        totalHighGas = Math.round(totalHighGas * 1000000 + Number.EPSILON)/1000000

        const gasFees = 
        {
            low: totalLowGas,
            avg:totalAvgGas,
            high:totalHighGas
        }

        resolve(gasFees)

      }).catch(function(err)
      {
        reject(err)
      })
    })
  }

  saveTransactionHistory(transaction_history:any)
  {
    // const headers = new HttpHeaders()
    // .set('Authorization', 'my-auth-token')
    // .set('Content-Type', 'application/json')

    // this.HttpClient.post(this.saveTransactionHistoryUrl,transaction_history, {
    //   headers: headers
    // })
    // .subscribe(data => {
    //   console.log(data);
    // })
    return this.HttpClient.post(this.saveTransactionHistoryUrl, transaction_history)
    .subscribe(
      error => console.log(error)
    );
  }

  saveNewUserAddress(new_user_address:any)
  {
    return this.HttpClient.post(this.saveNewUserAddressUrl, new_user_address)
    .subscribe(
      error => console.log(error)
    );
  }

  getTransactionHistory(find_address:any)
  {
     return this.HttpClient.post(this.getTransactionHistoryUrl,find_address)
  }

  // Error handling
  private error (error: any) {
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

}

