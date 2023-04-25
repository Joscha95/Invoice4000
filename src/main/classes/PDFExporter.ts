import PDFDocument from 'pdfkit'
import fs from 'fs'

class PositionXY{
    x;
    y;

    constructor(x = 0,y = 0){
        this.x = x;
        this.y = y;
    }
}

class PDFExporter{
    data;
    layout;
    figmaFile;
    resourcesPath:string;

    constructor(data:any,resourcesPath:string){
        this.data = data;
        this.resourcesPath = resourcesPath;
        this.data.json = JSON.parse(this.data.json);
    }

    async export(path:string){
        const doc = new PDFDocument({margin: 0,size: 'A4'});
        doc.pipe(fs.createWriteStream(path));

        
        const figmaFile = await this.getFigmaFile();
        const layout = this.data.json.quote ? figmaFile.quote : figmaFile.invoice;
        console.log();
        
        console.log(layout);
        
        const mainPos = new PositionXY(layout.data.absoluteBoundingBox.x,layout.data.absoluteBoundingBox.y);
        this.layout = layout;
        this.figmaFile = figmaFile;

        layout.data.children.forEach(mainlayer => {
            if(mainlayer.name == 'custom'){
                mainlayer.children.forEach(sublayer => {
                    switch(sublayer.type){
                        case 'TEXT':
                            this.addText(sublayer.characters,doc,sublayer,mainPos);
                            break;
                        case 'VECTOR':
                            this.addRect(sublayer,doc,mainPos);
                            break;
                        default:
                            break;
                    }
                });
            }
            

            if(mainlayer.name == 'required'){
                mainlayer.children.forEach(sublayer => {
                    switch(sublayer.type){
                        case 'TEXT':
                            let txt = '';
                            switch(sublayer.name){
                                case 'date':
                                    txt = this.data.json.date;
                                    break;
                                case 'invoice_number':
                                    txt = this.data.json.quote ? 'A'+this.data.json.orderNumber : this.data.json.number;
                                    break;
                                case 'client_number':
                                    txt = this.data.json.client_number;
                                    break;
                                case 'address':
                                    txt = this.data.json.client_adress;
                                    break;
                                default:
                                    break;

                            }

                            this.addText(txt,doc,sublayer,mainPos);
                            break;
                        default:

                    }
                });

                const cells = [
                    mainlayer.children.find( l => l.name == 'position'),
                    mainlayer.children.find( l => l.name == 'description'),
                    mainlayer.children.find( l => l.name == 'price')
                ];

                const cell_margin_bottom = 5;

                let oldY = cells[0].absoluteBoundingBox.y - mainPos.y;

                this.data.json.positions.forEach((p,i) => {
                    this.addTextXY((i+1).toString(), doc, cells[0], new PositionXY(cells[0].absoluteBoundingBox.x - mainPos.x,oldY));
                    this.addTextXY(p.text, doc, cells[1], new PositionXY(cells[1].absoluteBoundingBox.x - mainPos.x,oldY));
                    const newY = doc.y + cell_margin_bottom;
                    this.addTextXY(p.sum.toLocaleString('de-DE') +'E', doc, cells[2], new PositionXY(cells[2].absoluteBoundingBox.x - mainPos.x,oldY));
                    oldY = newY;
                });

                const sumCell = mainlayer.children.find( l => l.name == 'sum')

                this.addTextXY(`Summe: ${this.data.json.sum.toLocaleString('de-DE')}E` , doc, sumCell, new PositionXY(sumCell.absoluteBoundingBox.x- mainPos.x, oldY + cell_margin_bottom * 2));
                this.addTextXY(`Mehrwertsteuer(${this.data.json.taxrate}%): ${this.data.json.taxSum.toLocaleString('de-DE')}E`, doc, sumCell, new PositionXY(sumCell.absoluteBoundingBox.x- mainPos.x, doc.y + cell_margin_bottom));
                this.addTextXY(`Gesamt: ${this.data.json.overallSum.toLocaleString('de-DE')}E` , doc, sumCell, new PositionXY(sumCell.absoluteBoundingBox.x- mainPos.x, doc.y + cell_margin_bottom));
            }
        });
        
        doc.end();
    }

    async getFigmaFile(){
        const data = await fs.readFileSync(this.resourcesPath + '/settings.json', 'utf8');
        const s = JSON.parse(data);
        
        return s.figmaFile;
    }

    private addText(txt:string, doc:any, layer:any, mainPos:PositionXY):void{
        txt = txt.replace(/<br\s*\/?>/gi,'\n');
        if(layer.style.textCase=='UPPER') txt=txt.toUpperCase()
        doc.fontSize(layer.style.fontSize);
        const f = this.getFontFileName(layer.style.fontPostScriptName);

        if(f!='') doc.font(this.resourcesPath + '/fonts/'+f);
        doc.text(
          txt,
          layer.absoluteBoundingBox.x - mainPos.x, layer.absoluteBoundingBox.y - mainPos.y,
          {
            width: layer.absoluteBoundingBox.width,
            height: layer.absoluteBoundingBox.height,
            align: layer.style.textAlignHorizontal.toLowerCase(),
            characterSpacing: layer.style.letterSpacing,
            underline: layer.style.textDecoration== "UNDERLINE"
          }
        );
    }

    private addTextXY(txt:string, doc:any, layer:any, position: PositionXY):void{
        txt = txt.replace(/<br\s*\/?>/gi,'\n');
        doc.fontSize(layer.style.fontSize);
        if(layer.style.textCase=='UPPER') txt=txt.toUpperCase()

        const f = this.getFontFileName(layer.style.fontPostScriptName);
        if(f!='') doc.font(this.resourcesPath + '/fonts/'+f);
        doc.text(
          txt,
          position.x,
          position.y,
          {
            width: layer.absoluteBoundingBox.width,
            align:layer.style.textAlignHorizontal.toLowerCase(),
            characterSpacing: layer.style.letterSpacing,
            underline: layer.style.textDecoration== "UNDERLINE"
          }
        );
    }

    private addRect(layer:any,doc:any,mainPos:PositionXY){
        doc.rect(layer.absoluteBoundingBox.x - mainPos.x, layer.absoluteBoundingBox.y - mainPos.y, layer.absoluteBoundingBox.width,  layer.absoluteRenderBounds.height).fill('black')
    }

    private getFontFileName(key:string):string{
        const f = this.figmaFile.fontMap.find(f => f[0]==key);
        return f ? f[1] : '';
    }
}

export default PDFExporter;