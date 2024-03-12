import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  // @Input() tutorial?: Tutorial;
   @Output() refreshList: EventEmitter<any> = new EventEmitter();
   adr: string = '';
   addr: string|null = localStorage.getItem('WALLETID');
  
   currentTutorials: any[] = []; // Update the type based on your Tutorial model
  
   currentTutorial: Tutorial = {
     title: '',
     description: '',
     published: false
   };
   message = '';
 
   constructor(private tutorialService: TutorialService) { }
 
   ngOnInit(): void {
     this.message = '';
     if(this.addr!=null){
       this.adr=this.addr;
 }
 this.getTutorialsByAdr(this.adr);
   }
 
   ngOnChanges(): void {
     this.message = '';
     //this.currentTutorial = { ...this.tutorial };
   }
 
   updatePublished(status: boolean): void {
     if (this.currentTutorial.id) {
       this.tutorialService.updateA(this.currentTutorial.id, { published: status })
       .then(() => {
         this.currentTutorial.published = status;
         this.message = 'The status was updated successfully!';
       })
       .catch(err => console.log(err));
     }
   }
 
   updateTutorial(): void {
     const data = {
       title: this.currentTutorial.title,
       description: "auc",
       AcAmt:this.currentTutorial.AcAmt
     };
 
     if (this.currentTutorial.id) {
       this.tutorialService.updateA(this.currentTutorial.id, data)
         .then(() => this.message = 'The bid was updated successfully!')
         .catch(err => console.log(err));
     }
   }
 
   doneTutorial(): void {
     
       this.tutorialService.checkAndUpdateAcStats();
         
   }
 
   private getTutorialsByAdr(adr: string): void {
     this.tutorialService.getByField('adr', adr).subscribe(
       currentTutorials => {
         if (currentTutorials.length > 0) {
           const tutorial = currentTutorials[0];
           if (tutorial.AcStats === false) {
             alert('There is No Auction');
           } else {
             // Load the component or perform necessary action
             this.currentTutorial = tutorial;
             // Example: Load component
            
           }
         } else {
           console.log('No bid found with the given adr:', adr);
         }
       },
       error => {
         console.error('Error retrieving bid:', error);
       }
     );
   }
 }
 