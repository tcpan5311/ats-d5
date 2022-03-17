import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {MenuItem} from 'primeng/api'; 
import {Message,MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import { ethers } from 'ethers';
import { PrimeNGConfig } from 'primeng/api';
import { AbstractControl } from '@angular/forms';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IndexMainService } from './index-main.service';

@Component({
  selector: 'app-index-main',
  templateUrl: './index-main.component.html',
  styleUrls: ['./index-main.component.scss'],
  providers: [MessageService]
})
export class IndexMainComponent implements OnInit {


  items !: MenuItem[];
  displayModal:any
  txReviewModal: any
  window: any;
  eth: any
  privateKey : any = ""
  connectButtonLabel = "Connect wallet"
  panelAddressLabel = "Wallet not connected"
  panelBalanceLabel = "Balance not available"

  accountLoaded = false

  modal_msg !: Message[]
  index_msg !: Toast[]

  blockedPanel: boolean = false;

  i_amount !: number
  i_address !: String

  TokenFormGroup !: FormGroup
  inputAmount: any

  disableClick: any = true
  txReviewModalSiteLabel: string = window.location.href
  txReviewAmountLabel: string = ""


  constructor(private MessageService: MessageService,private cdr:ChangeDetectorRef,private PrimeNGConfig: PrimeNGConfig, private ims: IndexMainService) { }

  ngOnInit(): void {
    
    console.log(this.ims.getContractABI())
    console.log(this.ims.getContractAddress())

    let amount_regex = "^[0-9]*(\.[0-9]{0,2})?$"

    function addressFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {

       function isNotAddress(address:string)
       {
        try 
        {
            ethers.utils.getAddress(address)
            return false
        } 
        catch (error) 
        { 
            return true
        }
            
       }

        if (control.value !== undefined && control.value != "" && isNotAddress(control.value)) 
        {
            return { 'addressValid': true };
        }
        
        return null;
        
    }

    this.TokenFormGroup = new FormGroup({
        inputAmount:  new FormControl('', [Validators.required, Validators.pattern(amount_regex), Validators.max(10000)]),
        inputAddress:  new FormControl('', [Validators.required,addressFormatValidator]),
      });
  
       

    this.PrimeNGConfig.ripple = true


    if (typeof window !== 'undefined') 
    {
        this.eth = (window as any).ethereum
    }

    this.items = [

            {
                icon:'logo-icon'
            },
            
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

    get f()
    {
        return this.TokenFormGroup.controls;
    }

    openKeystoreModal()
    {
        this.displayModal = true;
    }

    uploadedFiles: any[] = [];
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
                // this.messageService.add({severity: 'error', summary: 'Error', detail: 'Multiple files upload are not allowed'});
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
        this.blockedPanel = true
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
                    this.blockedPanel = false
                }
            }
        }

        else
        {

            this.modal_msg = [
                {severity: 'error', summary: 'Error', detail: 'No key file are uploaded'}
            ];
            this.blockedPanel = false
        }
    }
    
 
//    connectWallet(metamask = this.eth)
//     {

//             return new Promise((resolve,reject)=>{
    
//                 try
//                 {
//                     if(!metamask) 
//                     {
//                         return alert('Please install Metamask')
//                     }
    
//                     else
//                     {
//                         Promise.all([metamask.request({ method: 'eth_requestAccounts' })]).then(([accounts])=>{
    
//                             console.log(accounts[0])
//                             resolve(accounts)
    
//                         })
//                     }
                    
//                 }
//                 catch(error)
//                 {
//                     console.log(error)
//                     throw new Error('No Ethereum object')
//                 }
    
//             })
//     }


        decryptFromPhase(mnemonic: any)
        {
            if(this.accountLoaded == false)
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
                    
                    this.connectButtonLabel = (`${node.address.slice(0, 7)} ... ${node.address.slice(35)}`)
                    this.panelAddressLabel = (`${node.address.slice(0, 7)} ... ${node.address.slice(35)}`)
                    this.displayModal = false
    
                    // console.log(node.privateKey)
                    // let wallet = new ethers.Wallet(node.privateKey);
                    this.privateKey = node.privateKey
                    this.getBalance(node.address)
                    this.uploadedFiles = []
                    this.blockedPanel = false
                }
    
                catch(error)
                {
    
                    this.modal_msg = [
                        {severity: 'error', summary: 'Error', detail: 'Invalid mnemonic phase provided'}
                    ];
                    this.blockedPanel = false
                }
            }

            else
            {
                this.modal_msg = [
                    {severity: 'error', summary: 'Error', detail: 'Wallet already imported'}
                ];
            }
            
        }
        
        getBalance(address: string)
        {
            const network = 'rinkeby' 
            const provider = ethers.getDefaultProvider(network)

            provider.getBalance(address).then((balance) => 
            {
                const balanceInEth = ethers.utils.formatEther(balance)
                this.panelBalanceLabel = (`Balance of account: ${balanceInEth} Ether`)
                this.MessageService.add({key: 't1', severity:'success', summary: 'Success', detail: 'Wallet imported successfully'});
                this.accountLoaded = true
            })
            
        }

        disconnectWallet()
        {
            this.privateKey = ""
            this.connectButtonLabel = "Connect wallet"
            this.panelAddressLabel = "Wallet not connected"
            this.panelBalanceLabel = "Balance not available"
            this.accountLoaded = false
            this.cdr.detectChanges()
            this.MessageService.add({key: 't1', severity:'success', summary: 'Success', detail: 'Wallet disconnected'});
        }       

        // getEthereumContract()
        // {


        //     // const provider = new ethers.providers.Web3Provider(ethereum)
        //     // const provider =  new ethers.providers.AlchemyProvider("rinkeby","ZntU6uxAx4IzPsZhH9TB5o0R6UvHuM3J")


        //     // const signer = provider.getSigner()
        //     const transactionContract = new ethers.Contract(
        //       contractAddress,
        //       contractABI,
        //       signer,
        //     )
          
        //     return transactionContract
        //   }

        confirmFeeModal()
        {
            
            this.txReviewModal = true
            this.txReviewAmountLabel = this.TokenFormGroup.value.inputAmount
            
        }

        sendTransaction()
        {

            if(this.accountLoaded == false)
            {
                this.MessageService.add({key: 't1', severity:'error', summary: 'Error', detail: 'Wallet not connected'});
            }

            else
            {
                const toAmount = this.TokenFormGroup.value.inputAmount
                const parsedAmount = ethers.utils.parseEther(toAmount)
                const toAddress = this.TokenFormGroup.value.inputAddress
    
                const provider = ethers.getDefaultProvider('rinkeby');
                const wallet = new ethers.Wallet(this.privateKey,provider)
    
                const tx = 
                {
                    to: toAddress,
                    gasLimit: 50000,
                    value: parsedAmount._hex,
                }
    
                Promise.all([wallet.sendTransaction(tx)]).then(([txObj])=>
                {
                    console.log('txHash:'+ txObj.hash)
                })
    
                let contractAddress = this.ims.getContractAddress()
                let contractABI = this.ims.getContractABI()
    
                const contract = new ethers.Contract(contractAddress,contractABI,wallet)

                Promise.all([contract.publishTransaction(toAddress,parsedAmount,`Transfering ETH ${parsedAmount} to ${toAddress}`,'TRANSFER',
                {gasLimit: 100000})])
                .then(([contractTxHash])=>
                {
                    console.log('Contract txHash:'+JSON.stringify(contractTxHash))
                })

            }
            
        }

        

        // decrypytPrivateKey()
        // {
        //    let keystore = 
        //    {"address":"880b0c348dabce31cfa2f9014c6445abb55d4459","id":"2a814f9c-aca1-4916-977f-aa9370a9a16d","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"31599959f4662ff245ea5f0b4e998738"},"ciphertext":"ec93c14e3b0d45c804f372c4d7c70e5f18ff9c2c8ac178b5306f226aefd69ec0","kdf":"scrypt","kdfparams":{"salt":"eddcfd446a855bc0d00557ac40f6bc790138e1b870f8bc9763be86301caf48d8","n":131072,"dklen":32,"p":1,"r":8},"mac":"08773fa9218d1bffc2bb06c62ad3ac76cd3963da8b2bed3bb30a12a96915abc3"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-03-09T18-01-48.0Z--880b0c348dabce31cfa2f9014c6445abb55d4459","mnemonicCounter":"08b42baf9c33138a2c3e7bb71e48a692","mnemonicCiphertext":"6541237aa057fc472d226fcc7a723c54","path":"m/44'/60'/0'/0/0","locale":"en","version":"0.1"}}  
        //    let json = JSON.stringify(keystore);
        //    let password = "firewall5311";

        //    ethers.Wallet.fromEncryptedJson(json, password).then(function(wallet) {
        //     console.log("Address: " + wallet.address);
        //     console.log("Private key:"+wallet.privateKey)
        // });
        // }

        

  }

