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

    constructor(data:any){
        this.data = data;
        this.data.json = JSON.parse(this.data.json);
        console.log(data);
    }

    async export(path:string){
        const doc = new PDFDocument({margin: 0});
        doc.pipe(fs.createWriteStream(path));

        doc.font('./appdata/fonts/FoundersGroteskMono-Regular.otf');
        const layout = await this.getLayout();

        layout.layers.forEach(mainlayer => {
            if(mainlayer.name == 'custom'){
                mainlayer.layers.forEach(sublayer => {
                    switch(sublayer.type){
                        case 'text':
                            this.addText(sublayer.text,doc,sublayer,mainlayer);
                            break;
                        default:
                            break;
                    }
                });
            }

            if(mainlayer.name == 'required'){
                mainlayer.layers.forEach(sublayer => {
                    switch(sublayer.type){
                        case 'text':
                            let txt = '';
                            switch(sublayer.name){
                                case 'date':
                                    txt = this.data.json.date;
                                    break;
                                case 'invoice_number':
                                    txt = this.data.json.number;
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

                            this.addText(txt,doc,sublayer,mainlayer);
                            break;
                        default:

                    }
                });

                const cells = [
                    mainlayer.layers.find( l => l.name == 'position'),
                    mainlayer.layers.find( l => l.name == 'description'),
                    mainlayer.layers.find( l => l.name == 'price')
                ];

                let oldY = cells[0].y + mainlayer.y;

                this.data.json.positions.forEach((p,i) => {
                    this.addTextXY(i.toString(), doc, cells[0], new PositionXY(cells[0].x + mainlayer.x,oldY));
                    this.addTextXY(p.text, doc, cells[1], new PositionXY(cells[1].x + mainlayer.x,oldY));
                    const newY = doc.y;
                    this.addTextXY(p.sum.toLocaleString('de-DE') +'E', doc, cells[2], new PositionXY(cells[2].x + mainlayer.x,oldY));
                    oldY = newY;
                });

                this.addTextXY(this.data.json.sum.toLocaleString('de-DE') +'E', doc, cells[2], new PositionXY(cells[2].x + mainlayer.x,oldY+10));
            }
        });
        
        doc.end();
    }

    async getLayout(){
        const data = await fs.readFileSync('./appdata/layouts/layout-jb/layout.json', 'utf8');
        return JSON.parse(data);
    }

    private addText(txt:string, doc:any, layer:any, parentlayer:any):void{
        txt = txt.replace(/<br\s*\/?>/gi,'\n');
        doc.fontSize(layer.size);
        doc.text(txt, layer.x + parentlayer.x, layer.y + parentlayer.y, {width: layer.width, height: layer.height, align:layer.justification});
    }

    private addTextXY(txt:string, doc:any, layer:any, position: PositionXY):void{
        txt = txt.replace(/<br\s*\/?>/gi,'\n');
        doc.fontSize(layer.size);
        doc.text(txt, position.x, position.y, {width: layer.width, align:layer.justification});
    }
}

export default PDFExporter;