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
    return '0x5d8D26EFaE918b43cd02E04184badE5ff2c18415'
  }

}
