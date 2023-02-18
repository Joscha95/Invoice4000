import Layout from "./Layout";

class FigmaFile{
  layouts:Layout[] = []
  constructor(){
  }

  import(d:any){
    this.layouts = [];
    console.log(true);
    
    d.document.children[0].children
    .filter( (c:any) => {
      return c.type == "FRAME" && c.absoluteBoundingBox.width == 595 && c.absoluteBoundingBox.height == 842;
    })
    .forEach((c:any) => {
      this.layouts.push( new Layout(c))
    });
  }

  load(d:any){
    
    d.layouts.forEach((l:any) => {
      const nl = new Layout(l.data);
      
      nl.initFontMap(l.fontMap);
      this.layouts.push( nl )
    });
  }

}

export default FigmaFile