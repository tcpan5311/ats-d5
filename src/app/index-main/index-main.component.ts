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
import { AuthService } from '../shared/auth.service';

import {DialogService} from 'primeng/dynamicdialog';
import { interval, Subscription,timer} from 'rxjs';
import { map, take } from 'rxjs/operators'

@Component({
  selector: 'app-index-main',
  templateUrl: './index-main.component.html',
  styleUrls: ['./index-main.component.scss'],
  providers: [DialogService,MessageService]
})
export class IndexMainComponent implements OnInit {


  items !: MenuItem[];
  displayModal:any
  txReviewModal: any
  txAdjustFeeModal: any  

  window: any;
  eth: any

  connectButtonLabel = "Connect wallet"
  panelAddressLabel = "Wallet not connected"
  panelBalanceLabel = "Balance not available"
  transactionReviewSenderLabel = ""
  transactionReviewReceiverLabel = ""

  accountLoaded = false

  modal_msg !: Message[]
  index_msg !: Toast[]

  blockedDocument: boolean = false;

  i_amount !: number
  i_address !: String

  TokenFormGroup !: FormGroup
  inputAmount: any

  disableClick: any = true
  txReviewModalSiteLabel: string = window.location.href
  txReviewAmountLabel: any = ""

  txs:any = []

  //View fee modal variables
  priorityRanges: any = []
  selectedPriorityRanges: any
  finalizedPriorityRanges: any
  averageGasFeeModalLabel: any = ""
  averageGasDescriptionModalLabel: any = ""
  totalFeeModalLabel: any = ""

  //Edit fee modal variables
  editGasFeeModalLabel: any = ""
  editGasDescriptionModalLabel: any = ""

//   interval
  intervalSubscription: any = Subscription
  timeLeft: number = 10;
  subscription: any =  Subscription;

  constructor(private MessageService: MessageService,private cdr:ChangeDetectorRef,
  private PrimeNGConfig: PrimeNGConfig, private ims: IndexMainService, private as:AuthService,
  public DialogService:DialogService) 
  {    
        
  }

  ngOnInit(): void {

    this.PrimeNGConfig.ripple = true;
    this.accountLoaded = false
    this.connectedToWallet()
    this.txReviewAmountLabel = "Not available"
    this.selectedPriorityRanges = this.priorityRanges[1]

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

                    this.ims.saveNewUserAddress(userAddressObj)

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
            if(this.as.getToken() != undefined)
            {
                this.connectButtonLabel = this.slicedAddress(this.as.getToken().address)
                this.panelAddressLabel = this.slicedAddress(this.as.getToken().address)
                this.transactionReviewSenderLabel = this.slicedAddress(this.as.getToken().address)
                this.accountLoaded = true
                this.readBalance()
                this.returnTransaction()
            }

            else
            {
                this.accountLoaded = false
            }
            
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

        confirmFeeModal()
        {
            if(this.accountLoaded == true)
            {
                if(this.TokenFormGroup.value.inputAmount !=undefined && this.TokenFormGroup.value.inputAddress != undefined)
                {
                    this.txReviewAmountLabel = this.TokenFormGroup.value.inputAmount
                    this.transactionReviewReceiverLabel = this.slicedAddress(this.TokenFormGroup.value.inputAddress)
                    this.getInitialGasFee()
                    this.getRealTimeGasFee()
                    this.txReviewModal = true
                }
            }

            else
            {
                this.MessageService.add({key: 't1', severity:'error', summary: 'Error', detail: 'Wallet not connected'});
            }
           
        }

        rejectFeeModal()
        {
            this.stopTimer()
            this.txReviewModal = false
            this.averageGasFeeModalLabel = ""
            this.editGasFeeModalLabel = ""
            this.averageGasDescriptionModalLabel = ""
            this.editGasDescriptionModalLabel = ""
            this.totalFeeModalLabel = ""
            this.totalFeeModalLabel = ""
        }

        launchAdjustFeeModal()
        {
            this.txAdjustFeeModal =  true
        }

        returnTransaction()
        {

            if(this.accountLoaded == true)
            {
                const searchAddressObj = 
                {
                    searchAddress: this.as.getToken().address
                }

              this.ims.getTransactionHistory(searchAddressObj).subscribe((response: any) =>
              {
                 response = response.map((r: { txHistory: any; }) => r.txHistory)
                 response = response[0]

                 this.txs = response.map((element:any, index:any) => {

                    return {
                                txHash: element.TxHash,
                                fromAddress: this.slicedAddress(element.From),
                                toAddress: this.slicedAddress(element.To),
                                amount: element.Amount,
                                timestamp: this.alterDateFormat(element.createdAt)
                            }
                });

                console.log(this.txs)


              })
                
                // console.log("This is return transaction")
                // //Initialize wallet and contract
                // const provider = ethers.getDefaultProvider('rinkeby');
                // let contractAddress = this.ims.getContractAddress()
                // let contractABI = this.ims.getContractABI()
                // const wallet = new ethers.Wallet(this.as.getToken().privateKey,provider)
                // const contract = new ethers.Contract(contractAddress,contractABI,wallet)


                // Promise.all([contract.readTransactionLength()]).then(([result])=>
                // {
                //     result = parseFloat(ethers.utils.formatEther(result))
                //     result = parseInt((result * Math.pow(10,18)).toFixed())
                    
                //     let tx_promises = []
                    
                //     let index = (result - 1)
                //     while(index >= 0)
                //     {
                //         let tx_promise = contract.readTransaction(index)
                //         tx_promises.push(tx_promise)

                //         index --
                //     }

                //     Promise.all(tx_promises).then((result)=>
                //     {
                //         this.txs = result.map((element, index) => {

                //             return {
                //               fromAddress: this.slicedAddress(this.as.getToken().address),
                //               toAddress: this.slicedAddress(element[0]),
                //               amount: ethers.utils.formatEther(element[1]),
                //               timestamp: element[2]
                //             }
                //           });
                //         this.cdr.detectChanges()
                //     });

                // })
            }
     
        }

        disconnectWallet()
        {
            sessionStorage.removeItem('key')
            this.connectedToWallet()
            this.uploadedFiles = []
            this.txs = []
            this.connectButtonLabel = "Connect wallet"
            this.panelAddressLabel = "Wallet not connected"
            this.transactionReviewSenderLabel = ""
            this.transactionReviewReceiverLabel = ""
            this.panelBalanceLabel = "Balance not available"
            this.MessageService.add({key: 't1', severity:'info', summary: 'Info', detail: 'Wallet disconnected'});
            this.cdr.detectChanges()
        }       

        getInitialGasFee = () => new Promise((resolve,reject) =>
        {
            this.ims.getGasFee().then((gas:any = {}) =>
            {   
                resolve(gas)

                if(this.finalizedPriorityRanges == undefined)
                {
                    this.priorityRanges = 
                    [
                        {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                        {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                        {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                    ]
                    this.selectedPriorityRanges = this.priorityRanges[1]

                    this.averageGasFeeModalLabel = gas.avg
                    this.editGasFeeModalLabel = gas.avg
                    this.averageGasDescriptionModalLabel = 'Completed in <30 seconds'
                    this.editGasDescriptionModalLabel = 'Completed in <30 seconds'
                    this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(gas.avg)
                    this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                }

                else if(this.finalizedPriorityRanges.name == 'Low')
                {
                    this.priorityRanges = 
                    [
                        {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                        {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                        {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                    ]
                    this.selectedPriorityRanges = this.priorityRanges[0]

                    this.averageGasFeeModalLabel = gas.low
                    this.editGasFeeModalLabel = gas.low
                    this.averageGasDescriptionModalLabel = 'Perhaps in 30 seconds'
                    this.editGasDescriptionModalLabel = 'Perhaps in 30 seconds'
                    this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                    this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                }

                else if(this.finalizedPriorityRanges.name == 'Medium')
                {
                    this.priorityRanges = 
                    [
                        {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                        {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                        {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                    ]
                    this.selectedPriorityRanges = this.priorityRanges[1]

                    this.averageGasFeeModalLabel = gas.avg
                    this.editGasFeeModalLabel = gas.avg
                    this.averageGasDescriptionModalLabel = 'Completed in <30 seconds'
                    this.editGasDescriptionModalLabel = 'Completed in <30 seconds'
                    this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                    this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                }

                else if(this.finalizedPriorityRanges.name == 'High')
                {
                    this.priorityRanges = 
                    [
                        {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                        {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                        {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                    ]
                    this.selectedPriorityRanges = this.priorityRanges[2]

                    this.averageGasFeeModalLabel = gas.high
                    this.editGasFeeModalLabel = gas.high
                    this.averageGasDescriptionModalLabel = 'Completed in <15 seconds'
                    this.editGasDescriptionModalLabel = 'Completed in <15 seconds'
                    this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                    this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                }

                // this.selectedPriorityRanges = this.priorityRanges[1]
               
            })  
        })

        getRealTimeGasFee()
        {
            // this.totalFeeModalLabel = ""
            const length = 11
            
            this.intervalSubscription = 
            interval(1000).pipe(take(length), map(count => length - count)).subscribe(seconds => {

                this.timeLeft = (seconds - 1)
                
                 if(seconds == 1)
                 {
                    new Promise((resolve,reject) =>
                    {

                        this.ims.getGasFee().then((gas:any = {}) =>
                        {   
                            
                            resolve(gas)
                            console.log(gas)
            
                            if(this.finalizedPriorityRanges == undefined)
                            {
                                this.priorityRanges = 
                                [
                                    {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                                    {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                                    {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                                ]
                                this.selectedPriorityRanges = this.priorityRanges[1]
            
                                this.averageGasFeeModalLabel = gas.avg
                                this.editGasFeeModalLabel = gas.avg
                                this.averageGasDescriptionModalLabel = 'Completed in <30 seconds'
                                this.editGasDescriptionModalLabel = 'Completed in <30 seconds'
                                this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                                this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                            }
            
                            else if(this.finalizedPriorityRanges.name == 'Low')
                            {
                                this.priorityRanges = 
                                [
                                    {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                                    {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                                    {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                                ]
                                this.selectedPriorityRanges = this.priorityRanges[0]
            
                                this.averageGasFeeModalLabel = gas.low
                                this.editGasFeeModalLabel = gas.low
                                this.averageGasDescriptionModalLabel = 'Perhaps in 30 seconds'
                                this.editGasDescriptionModalLabel = 'Perhaps in 30 seconds'
                                this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                                this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                            }
            
                            else if(this.finalizedPriorityRanges.name == 'Medium')
                            {
                                this.selectedPriorityRanges = this.priorityRanges[1]
                                this.priorityRanges = 
                                [
                                    {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                                    {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                                    {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                                ]
                                this.selectedPriorityRanges = this.priorityRanges[1]
            
                                this.averageGasFeeModalLabel = gas.avg
                                this.editGasFeeModalLabel = gas.avg
                                this.averageGasDescriptionModalLabel = 'Completed in <30 seconds'
                                this.editGasDescriptionModalLabel = 'Completed in <30 seconds'
                                this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                                this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                            }
            
                            else if(this.finalizedPriorityRanges.name == 'High')
                            {
                                this.selectedPriorityRanges = this.priorityRanges[2]
                                this.priorityRanges = 
                                [
                                    {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                                    {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                                    {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                                ]
                                this.selectedPriorityRanges = this.priorityRanges[2]
            
                                this.averageGasFeeModalLabel = gas.high
                                this.editGasFeeModalLabel = gas.high
                                this.averageGasDescriptionModalLabel = 'Completed in <15 seconds'
                                this.editGasDescriptionModalLabel = 'Completed in <15 seconds'
                                this.totalFeeModalLabel = parseFloat(this.txReviewAmountLabel) + parseFloat(this.averageGasFeeModalLabel)
                                this.totalFeeModalLabel = Math.round(this.totalFeeModalLabel * 1000000 + Number.EPSILON)/1000000
                            }

                            this.getRealTimeGasFee()

                        })  

                        

                        // this.ims.getGasFee().then((gas:any = {}) =>
                        // {   
                        //     resolve(gas)
                        //     this.averageGasFeeModalLabel = gas.avg
                        //     this.averageGasDescriptionModalLabel = 'Completed in <30 seconds'
                        //     this.priorityRanges = 
                        //     [
                        //         {name: 'Low', fee: `${gas.low}`, keyword:'Perhaps in 30 seconds'}, 
                        //         {name: 'Medium', fee: `${gas.avg}`, keyword:'Completed in <30 seconds'},
                        //         {name: 'High', fee: `${gas.high}`,keyword:'Completed in <15 seconds'}
                        //     ]
                        //     this.selectedPriorityRanges = this.priorityRanges[1]
                        //     this.editGasFeeModalLabel = gas.avg
                        //     this.editGasDescriptionModalLabel = 'Completed in <30 seconds'
                        //     console.log(gas)
                        //     this.getRealTimeGasFee()

                        // })  


                    })
                 }

              })
        }

        sendTransaction()
        {
            if(this.accountLoaded == true)
            {
                this.txReviewModal = false
                this.blockedDocument = true
                //Initialize wallet and contract
                const provider = ethers.getDefaultProvider('rinkeby');
                const contractAddress = this.ims.getContractAddress()
                const contractABI = this.ims.getContractABI()
                const wallet = new ethers.Wallet(this.as.getToken().privateKey,provider)
                const contract = new ethers.Contract(contractAddress,contractABI,wallet)

                const toAmount = this.TokenFormGroup.value.inputAmount
                const parsedAmount = ethers.utils.parseEther(toAmount)
                console.log(ethers.utils.formatEther(parsedAmount))
                const gLimit = 100000
                const gPrice = (this.averageGasFeeModalLabel/gLimit) * 10 ** 18
                const toAddress = this.TokenFormGroup.value.inputAddress
                                
                //gasPrice: 
                const tx = 
                {
                    to: toAddress,
                    gasLimit: gLimit,
                    gasPrice: gPrice,
                    value: parsedAmount._hex
                }
    
                Promise.all([wallet.sendTransaction(tx)]).then(([txObj])=>
                {
                    const txHash = txObj.hash.toString()
                    this.txReviewModal = false

                    Promise.all([txObj.wait()]).then(([result]) =>
                    {
                        const txHistoryObj = 
                        {
                            TxHash: txObj.hash,
                            From: this.as.getToken().address,
                            To: toAddress,
                            Amount: toAmount
                        }
                        this.ims.saveTransactionHistory(txHistoryObj)
                        
                        this.TokenFormGroup.reset()
                        this.stopTimer()
                        this.blockedDocument = false
                        this.connectedToWallet()
                        this.cdr.detectChanges()
                    })

                    // Promise.all([contract.publishTransaction(toAddress,parsedAmount,timeStamp,
                    // {gasLimit: 900000})])
                    // .then(([contractTxHash])=>
                    // {
                    //     console.log('Contract txHash:'+contractTxHash.hash)
                    //     console.log('Transaction completed')
                    //     this.TokenFormGroup.reset()
                    //     this.stopTimer()
                    //     this.blockedDocument = false
                    //     this.connectedToWallet()
                    //     this.returnTransaction()
                    //     this.cdr.detectChanges()
                    // })
                }).catch
                {
                    this.stopTimer()
                }
            }

            else
            {
                this.MessageService.add({key: 't1', severity:'error', summary: 'Error', detail: 'Wallet not connected'});
            }
                
        }

        editFeePriority()
        {
            this.editGasFeeModalLabel = this.selectedPriorityRanges.fee
            this.editGasDescriptionModalLabel = this.selectedPriorityRanges.keyword
        }

        saveFeePriority()
        {
            if (this.intervalSubscription)
            {
                this.intervalSubscription.unsubscribe();
                this.finalizedPriorityRanges = this.selectedPriorityRanges
                this.txAdjustFeeModal = false
                this.getInitialGasFee()
                this.getRealTimeGasFee()
            }
        }

        slicedAddress(value:string)
        {
            return (`${value.slice(0, 7)} ... ${value.slice(35)}`)
        }

        alterDateFormat(value:any)
        {
            value = new Date(value)
            let timeStamp = value.getDate().toLocaleString()+"-"
            +(value.getMonth()+1).toLocaleString()+"-"
            +value.getFullYear()+" "
            +value.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            return timeStamp
        }

        lockScreen()
        {
            if(this.blockedDocument == false)
            {
                this.blockedDocument = true
            }

            else
            {
                this.blockedDocument = false
            }

        }

        stopTimer()
        {
            if (this.intervalSubscription)
            {
                this.intervalSubscription.unsubscribe();
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

         // getBalance(address: string)
        // {
        //     const network = 'rinkeby' 
        //     const provider = ethers.getDefaultProvider(network)

        //     provider.getBalance(address).then((balance) => 
        //     {
        //         const balanceInEth = ethers.utils.formatEther(balance)
        //         this.panelBalanceLabel = (`Balance of account: ${balanceInEth} Ether`)
        //         this.MessageService.add({key: 't1', severity:'success', summary: 'Success', detail: 'Wallet imported successfully'});
        //         this.accountLoaded = true
        //         this.returnTransaction()
        //     })
            
        // }

        
    
    }

