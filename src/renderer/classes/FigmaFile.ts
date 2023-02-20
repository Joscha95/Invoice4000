import Layout from "./Layout";

class FigmaFile{
  layouts:Layout[] = []
  quote?:Layout
  invoice?:Layout
  fontMap:string[][] = []
  name:string = ''

  constructor(){
  }

  import(d:any){
    this.layouts = [];
    
    d.document.children[0].children
    .filter( (c:any) => {
      return c.type == "FRAME" && c.absoluteBoundingBox.width == 595 && c.absoluteBoundingBox.height == 842 && (c.name=="quote_4000" || c.name=="invoice_4000");
    })
    .forEach((c:any) => {
      this.layouts.push( new Layout(c));
      console.log(c);
      
    });
    this.updateLayouts();
    this.name = d.name;
  }

  load(d:any){
    
    d?.layouts.forEach((l:any) => {
      const nl = new Layout(l.data);
      this.layouts.push( nl )
    });

    this.name = d?.name;

    if(d) this.initFontMap(d.fontMap);
    this.updateLayouts();
  }

  updateLayouts(){
    this.invoice = this.layouts.find(l => l.name == "invoice_4000");
    this.quote = this.layouts.find(l => l.name == "quote_4000") ;
    console.log(this.quote);
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

  public get fonts():string[]{
    return [...new Set(this.layouts.reduce((fonts:string[],l:Layout) => fonts.concat(l.fonts),[] as string[]))]
  }

}

export default FigmaFile