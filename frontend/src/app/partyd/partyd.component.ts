import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partyd',
  templateUrl: './partyd.component.html',
  styleUrls: ['./partyd.component.scss']
})
export class PartydComponent implements OnInit {
  partyDetails: any; // Define a variable to hold party details

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieve the query parameters from the activated route
    this.route.queryParams.subscribe(params => {
      // Check if partyDetails parameter exists
      if (params['partyDetails']) {
        // Parse the JSON string into an object and assign it to partyDetails
        this.partyDetails = JSON.parse(params['partyDetails']);
        console.log("vikas")
        console.log('Party Details Received:', this.partyDetails);
        //console.log(this.partyDetails.response[0]);
      }
    });
  }
}
