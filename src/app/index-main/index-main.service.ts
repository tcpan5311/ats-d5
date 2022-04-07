import { Injectable } from '@angular/core';
import abi from '../../lib/Transactions.json'
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndexMainService {

  private fetchGasFeeUrl =  'http://localhost:3000/getGasFee'
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

        const gasLimit = 50000
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

  // Error handling
  private error (error: any) {
    let message = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

}

