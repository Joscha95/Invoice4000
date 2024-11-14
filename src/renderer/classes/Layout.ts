class Layout{
  data;
  name: string;
  

  public get isValid(): boolean|string {
      
    const req = this.data.children.find((l:any) => l.name =='required');
    if(!req) return 'missing layer: required';

    let msg = '';
    const requirements = ['price','description','position','sum','taxSum','overallSum'];
    requirements.forEach((r:string) => {
        const req_field = req.children.find((l:any) => l.name == r);
        if(!req_field) msg += 'missing required field: '+r+'<br/>';
    });

    return msg == '' ? true : msg;
    
  }

  public get fonts(): string[]{
      let fts:string[] = [];
      const children:any[] = [];

      this._getFonts(this.data, fts);
      fts = fts.filter((value, index, self) => {
          return self.indexOf(value) === index;
      })
      return fts;
  }

  get title(){

    return this.name;

  }

  get serializable(){
    return {
      data: this.data,
      name: this.name
    }
  }

  constructor(d:any){

    this.data = d;
    
    this.name = d.name;

  }

  private _getFonts(l:any, fts:string[]):void{
      
      if(l.children){
          l.children.forEach((l:any) => {
              this._getFonts(l, fts);
          });
      } else{
          if(l.type == "TEXT") fts.push(l.style.fontPostScriptName);
          
      }
  }
}


export default Layout;