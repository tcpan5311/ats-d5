import { Injectable } from '@angular/core';
import abi from '../../lib/Transactions.json'

@Injectable({
  providedIn: 'root'
})
export class IndexMainService {

  constructor() { }

  getContractABI()
  {
    return abi.abi
  }

  getContractAddress()
  {
    return '0x26b28eA48c8aEF1E3A83e141891f5b3df93F5717'
  }

}
