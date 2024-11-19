import store from "../store";
import Layout from "./Layout";
import LayoutInvoice from "./LayoutInvoice";
import LayoutQuote from "./LayoutQuote";

class FigmaFile{
  invoiceLayouts:LayoutInvoice[] = []
  quoteLayouts:Map<string, LayoutQuote> = new Map();

  invoiceID?:string
  fontMap:string[][] = []
  name:string = ''

  get currentLayout(){
    return this.invoiceLayouts.find( _l => this.invoiceID == _l.title)
  }

  public get fonts():string[]{
    return [...new Set(this.invoiceLayouts.reduce((fonts:string[],l:Layout) => fonts.concat(l.fonts),[] as string[]))]
  }

  get invoiceLayout(){
    
    return this.invoiceLayouts.find( l => l.title == this.invoiceID);

  }

  get serialized(){
    return {
      invoiceLayouts: this.invoiceLayouts.map( l => l.serializable),
      quoteLayouts: [...this.quoteLayouts],
      invoiceID: this.invoiceID,
      fontMap: this.fontMap,
      name: this.name,
    }
  }

  constructor(){

  }

  import(d:any){
    this._clear();
    
    d.document.children[0].children
    .filter( (c:any) => {
      
      return c.type == "FRAME" && c.absoluteBoundingBox.width == 595 && c.absoluteBoundingBox.height == 842 && (c.name.includes("quote_4000") || c.name.includes("invoice_4000"));

    }).forEach((c:any) => {
      
      this._loadData(c)
      
    });

    this.name = d.name;
    
    this.updateLayouts();

  }

  load(d?:FigmaFile){

    d?.invoiceLayouts.forEach((l:any) => {

      this._loadData(l.data)
      
    });

    this.quoteLayouts = new Map(d?.quoteLayouts);

    this.name = d?.name || 'undefined';
    this.invoiceID = d?.invoiceID;


    if(d) this.initFontMap(d.fontMap);
    this.updateLayouts();

  }

  private _clear(){
    this.invoiceLayouts = [];
    this.quoteLayouts.clear();
  }

  private _loadData(d:any){
    
    const _layout = d.name.includes('quote_4000') ? LayoutQuote : LayoutInvoice;
    
    const nl = new _layout(d);
    
    nl instanceof LayoutInvoice ? this.invoiceLayouts.push( nl ) : this.quoteLayouts.set(nl.title, nl );

  }

  updateLayouts(){

    this.invoiceLayouts.forEach( inv => inv.quoteLayout = this.quoteLayouts.get(inv.title))
    
  }

  setFontMap(key:string,value:string){
    const f = this.fontMap.find((k:string[]) => { return k[0] == key });

    if(f) {
        f[1] = value;
    }else{
        this.fontMap.push([key,value]);
    }
  }

  initFontMap(m:any){
    this.fontMap = m;
  }

  getFontFileName(key:string){
    const f = this.fontMap.find((k:string[]) => { return k[0] == key });

    if(f) {
        return f[1]
    }else{
        return ''
    }
  }

  

}

export default FigmaFile