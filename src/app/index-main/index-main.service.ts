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
    return '0xF08C79B6fA5782a5DfEFB7911c2c23dAc5781d42'
  }

}
