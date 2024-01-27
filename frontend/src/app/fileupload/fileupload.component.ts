import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  selectedFile: File | null = null;
  fileUpload: FileUpload | null = null;
  url="uuuuu";
  s=0;
  constructor(private fileUploadService: FileUploadService) {}
  ngOnInit(): void {
    
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

   async  uploadFile() {
    if (this.selectedFile) {      
      const fileUpload = new FileUpload(this.selectedFile);
      this.fileUploadService.getUrl(fileUpload).subscribe(
        url => {
         
          console.log('File URL:', url);

          this.url = url;
          this.s=1;
        },
        error => {
          console.error('Error getting file URL:', error);
        }
      );
    }else{
      console.log("some problem")
    }
  }
}
