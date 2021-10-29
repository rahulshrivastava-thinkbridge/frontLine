import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.scss']
})
export class UploadInvoiceComponent implements OnInit {
  public formData = new FormData();
  ReqJson: any = {};
  public fileName = '';
  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event) {
    console.log('===>',event);
    if(event){
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      console.log('==>',formData);
      
    }
  }else {
    const file: File = event;
    if (file) {
      this.fileName = '';
      const formData = new FormData();
      formData.append("thumbnail", file);
      console.log('==>',formData);
    }
  }
  }

  deleteinvoice() {
    this.onFileSelected('');
  }

  importFile(file) {
    console.log('file', file)
    for (let i = 0; i < file.length; i++) {
      this.formData.append("file", file[i], file[i]['name']);
    }
  }

  RequestUpload() {
    this.ReqJson["patientId"] = "12"
    this.ReqJson["requesterName"] = "test1"
    this.ReqJson["requestDate"] = "1/1/2019"
    this.ReqJson["location"] = "INDIA"
    this.formData.append('Info', JSON.stringify(this.ReqJson))
    // this.http.post( '/Request', this.formData )
    //     .subscribe(( ) => {                 
    //     });     
  }


}
