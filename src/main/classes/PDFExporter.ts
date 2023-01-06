import PDFDocument from 'pdfkit'
import fs from 'fs'

class PDFExporter{
    data;

    constructor(data:any){
        this.data = data;
    }

    export(path:string){
        const doc = new PDFDocument();
        
        doc.pipe(fs.createWriteStream(path));
    }
}

export default PDFExporter;