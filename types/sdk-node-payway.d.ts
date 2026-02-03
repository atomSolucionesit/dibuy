declare module 'sdk-node-payway' {
  export class sdk {
    constructor(ambient: string, publicKey: string, privateKey: string, company: string, user: string);
    
    checkoutHash: new (sdk: any, args: any) => Promise<any>;
    internaltokens(args: any, callback: (result: any, err: any) => void): void;
    cryptogramPayment(args: any, callback: (result: any, err: any) => void): void;
    cardTokens(userId: string, callback: (result: any, err: any) => void): void;
    payment(args: any, callback: (result: any, err: any) => void): void;
  }
}