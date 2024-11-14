import Layout from "./Layout";

export default class LayoutQuote extends Layout{

  override get title(){

    return this.name.replace('quote_4000_','');
    
  }

  constructor(d:any){
    super(d)
  }

}