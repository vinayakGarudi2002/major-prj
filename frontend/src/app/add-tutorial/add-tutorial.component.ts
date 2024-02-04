import { Component, Input, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {
  tutorial: Tutorial = new Tutorial;
  //tutorial: Tutorial = new Tutorial();
  submitted = false;

  //popu
  adr: string = '';
  addr: string|null = localStorage.getItem('WALLETID');
 
  tutorials: any[] = []; // Update the type based on your Tutorial model
  currentTutorial?: Tutorial;
  //file
  selectedFile: File | null = null;
  fileUpload: FileUpload | null = null;
  url="uuuuu";
  constructor(private fileUploadService: FileUploadService,private tutorialService: TutorialService) { }

  ngOnInit(): void {
     if(this.addr!=null){
           this.adr=this.addr;
     }
    this.getTutorialsByAdr(this.adr);
  }

  saveTutorial(): void {
    this.tutorial.adr=this.adr;
    this.tutorial.description="submited";
    this.tutorialService.create(this.tutorial).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = new Tutorial();
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
          this.tutorial.pdf=url;
          
        },
        error => {
          console.error('Error getting file URL:', error);
        }
      );
    }else{
      console.log("some problem")
    }
  }

  private getTutorialsByAdr(adr: string): void {
    this.tutorialService.getByField('adr', adr).subscribe(
      tutorials => {
        // Handle retrieved tutorials
        if(tutorials[0]){
        this.tutorials = tutorials;
        this.tutorial=tutorials[0];
        console.log('Tutorials with adr:', tutorials);}
      },
      error => {
        console.error('Error retrieving tutorials:', error);
      }
    );
  }

}
