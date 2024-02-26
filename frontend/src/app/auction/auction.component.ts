import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { map } from 'rxjs/operators';
import { Tutorial } from 'src/app/models/tutorial.model';
import { Router } from "@angular/router";
@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial?: Tutorial;
  currentIndex = 0;
  title = '';
  adr: string | null = localStorage.getItem('WALLETID'); // adr of current logged in user 

  constructor(  private router: Router,private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.currentTutorial = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    if (this.adr) {
      this.tutorialService.getAll().snapshotChanges().pipe(
        map(changes =>
          changes.map(c => {
            const data = c.payload.doc.data() as Tutorial; // Cast data to Tutorial type
            if (data.AcStats === true) { // Filter tutorials where AcStats is true
              return { id: c.payload.doc.id, ...data };
            } else {
              if (data.adr === this.adr) { // Check if the current adr matches
                alert('AcStats is false for the current adr');
              }
              this.router
              .navigateByUrl("/", { skipLocationChange: true })
              .then(() =>
                this.router.navigate([`my-bids`])
              );
              return null; // Skip this tutorial

            }
          }).filter(tutorial => tutorial !== null) // Remove null entries
        ),
      ).subscribe(data => {
        this.tutorials = data as Tutorial[]; // Type assertion
      });
    }
  }
  
  
  

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }
}
