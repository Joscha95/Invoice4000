import PDFDocument from 'pdfkit'
import fs from 'fs'

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
        const layout = await this.getLayout();

        layout.layers.forEach(mainlayer => {
            if(mainlayer.name == 'custom'){
                mainlayer.layers.forEach(sublayer => {
                    switch(sublayer.type){
                        case 'text':
                            const txt = sublayer.text.replace(/<br\s*\/?>/gi,'\n');
                            doc.fontSize(sublayer.size);
                            doc.text(txt, sublayer.x + mainlayer.x, sublayer.y + mainlayer.y, {width: sublayer.width, height: sublayer.height, align:sublayer.justification});
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

                            txt = txt.replace(/<br\s*\/?>/gi,'\n');
                            doc.fontSize(sublayer.size);
                            doc.text(txt, sublayer.x + mainlayer.x, sublayer.y + mainlayer.y, {width: sublayer.width, height: sublayer.height, align:sublayer.justification});
                            break;
                        default:

                    }
                });
            }
        });
        
        doc.end();
    }

    async getLayout(){
        const data = await fs.readFileSync('./appdata/layouts/layout jb/a4___1.json', 'utf8');
        return JSON.parse(data);
    }
}

export default PDFExporter;