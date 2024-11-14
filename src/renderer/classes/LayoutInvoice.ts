import Layout from "./Layout";
import LayoutQuote from "./LayoutQuote";

export default class LayoutInvoice extends Layout{

  quoteLayout: LayoutQuote|undefined;
  
  override get title(){

    return this.name.replace('invoice_4000_','');

  }

  constructor(d:any){
    super(d)
  }

}