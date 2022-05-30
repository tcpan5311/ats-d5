import {Component,OnInit,ChangeDetectorRef} from '@angular/core';
import {MenuItem} from 'primeng/api'; 
import {DialogService} from 'primeng/dynamicdialog';
import {Message,MessageService} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {FieldsetModule} from 'primeng/fieldset';


import { ethers } from 'ethers';

import { AuthService } from '../app/shared/auth.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService,MessageService]
})
export class AppComponent {

  modal_msg !: Message[]

  items !: MenuItem[];
  displayModal:any
  uploadedFiles: any[] = [];

  connectButtonLabel = "Connect wallet"
  panelAddressLabel = "Wallet not connected"
  panelBalanceLabel = "Balance not available"
  accountLoaded = false

  constructor(private MessageService: MessageService,private cdr:ChangeDetectorRef,private as:AuthService,private aps:AppService) 
  { 
    this.as.ReadBalanceMethodCalled$.subscribe(()=>
    {
        this.readBalance()
    });
  }

  ngOnInit(): void {

    this.accountLoaded = false

    this.connectedToWallet()

    this.items = [

      // {
      //     icon:'logo-icon'
      // },
      
      {
          label: 'Send',
          icon: 'pi pi-send'
      },
      {
          label: 'Swap',
          icon: ' pi pi-sort-alt'
      },

      {
          label: 'Pool',
          icon: 'pi pi-database'
      },

      {
          label:'Vote',
          icon: 'pi pi-id-card'
      },

      {
          label:'Charts',
          icon: 'pi pi-chart-line'
      }

  ];

  }

  openKeystoreModal()
  {
    this.displayModal = true
  }

  onUploadFile(e:any,fileUpload:any)
  {
      console.log("File uploaded")
      for(let file of e.files) {
          
          if(this.uploadedFiles.length <= 0)
          {
              this.uploadedFiles.push(file);
          }

          else
          {
              this.modal_msg = [
                  {severity: 'warn', summary: 'Warning', detail: 'Please remove imported file first'}
              ];
          }
      }

      fileUpload.clear()
      
  }

  removeUpload()
  {
      this.uploadedFiles = []
      this.cdr.detectChanges()
  }

  importWallet()
  {
      if(this.uploadedFiles.length != 0)
      {
          let fileReader = new FileReader();
          fileReader.readAsText(this.uploadedFiles[0]);
          fileReader.onload = (e) => {
              if(fileReader.result != "" && fileReader.result != null)
              {
                  console.log(fileReader.result);
                  this.decryptFromPhase(fileReader.result)
                  
                  
              }

              else
              {
                  this.modal_msg = [
                      {severity: 'error', summary: 'Error', detail: 'File is empty'}
                  ];
              }
          }
      }

      else
      {

          this.modal_msg = [
              {severity: 'error', summary: 'Error', detail: 'No key file are uploaded'}
          ];
      }
  }

  decryptFromPhase(mnemonic: any)
  {
      if(this.as.getToken() == undefined)
      {
          let walletPath = {
              "standard": "m/44'/60'/0'/0/0", 
              // Changing the last digit will give the sequence of address
              // For Ex: "m/44'/60'/0'/0/1" will give 2nd Address
          
          };
          
          try
          {
              //mnemonic phase = "fault calm wash deal icon tattoo aware thumb brown merit barrel hamster";
              const hdnode = ethers.utils.HDNode.fromMnemonic(mnemonic);
              const node = hdnode.derivePath(walletPath.standard);
              this.as.saveToken(node)
              const userAddressObj = 
              {
                  address: node.address
              }

              this.aps.saveNewUserAddress(userAddressObj)

              this.connectedToWallet()
              this.uploadedFiles = []
              this.displayModal = false
              this.MessageService.add({key: 't1', severity:'success', summary: 'Success', detail: 'Wallet imported successfully'});
          }

          catch(error)
          {
              console.log(error)
              this.modal_msg = [
                  {severity: 'error', summary: 'Error', detail: 'Invalid mnemonic phase provided'}
              ];
          }
      }

      else
      {
          this.modal_msg = [
              {severity: 'error', summary: 'Error', detail: 'Wallet already imported'}
          ];
      }
      
  }

  connectedToWallet()
  {
      if(this.as.verifyConnectWallet() == true)
      {
          this.connectButtonLabel = this.slicedAddress(this.as.getToken().address)
          this.panelAddressLabel = this.slicedAddress(this.as.getToken().address)
          this.as.callConnectWalletMethod()
          this.accountLoaded = true
          this.readBalance()
      }

      else
      {
          this.accountLoaded = false
      }
      
  }

  disconnectWallet()
  {
      sessionStorage.removeItem('key')
      this.as.callDisconnectWalletMethod()
      this.connectedToWallet()
      this.uploadedFiles = []
      this.connectButtonLabel = "Connect wallet"
      this.panelAddressLabel = "Wallet not connected"
      this.panelBalanceLabel = "Balance not available"
      this.MessageService.add({key: 't1', severity:'info', summary: 'Info', detail: 'Wallet disconnected'});
      this.cdr.detectChanges()
  }       

  readBalance()
  {
      if(this.accountLoaded == true)
      {
          this.panelBalanceLabel = "Loading..."
          const provider = ethers.getDefaultProvider('rinkeby')

          provider.getBalance(this.as.getToken().address).then((balance) => 
          {
              let balanceInEth = parseFloat(ethers.utils.formatEther(balance))
              balanceInEth = Math.round(balanceInEth * 10000 + Number.EPSILON)/10000

              this.panelBalanceLabel = (`Balance of account: ${balanceInEth} Ether`)
              this.cdr.detectChanges()
          })
      }
      
  }

  //Generic functions
  slicedAddress(value:string)
  {
      return (`${value.slice(0, 7)} ... ${value.slice(35)}`)
  }

}
