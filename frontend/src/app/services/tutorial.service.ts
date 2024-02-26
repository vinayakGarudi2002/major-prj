import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
import { Tutorial } from '../models/tutorial.model';
import { Observable, map, switchMap, timer } from 'rxjs';

interface AdrBid {
  adrs: string;
  bids: number;
}

interface AuctionData {
  address: string;
  amount: number;
}
@Injectable({
  providedIn: 'root'
})


export class TutorialService {
  private dbPath = '/tutorials';
  private auctionStartTime: Date;
  private auctionEndTime: Date;
  tutorialsRef: AngularFirestoreCollection<Tutorial>;

  constructor(private db: AngularFirestore) {
    this.tutorialsRef = db.collection(this.dbPath);
    this.auctionStartTime = new Date('2024-02-22T09:00:00'); // Example start time
    this.auctionEndTime = new Date('2024-03-22T17:00:00'); // Example end time
  }

  getAll(): AngularFirestoreCollection<Tutorial> {
    return this.tutorialsRef;
  }

  create(tutorial: Tutorial): any {
    return this.tutorialsRef.add({ ...tutorial });
  }

  updateA(id: string, data: any): Promise<void> {
    // Check if current time is within auction period
    const currentTime = new Date();
    if (currentTime >= this.auctionStartTime && currentTime <= this.auctionEndTime) {
      return this.tutorialsRef.doc(id).update(data);
    } else {
      alert("Bidding is Over");
      return Promise.reject("Bidding is not allowed at this time.");
    }
  }


  
  updateAcStatsForAdr(adrsBids: AdrBid[], status: boolean): void {
    adrsBids.forEach(adrsBid => {
      const adrLower = adrsBid.adrs.toLowerCase(); // Convert adr to lowercase
      this.tutorialsRef.ref.where('adr', '==', adrLower).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const tutorial = doc.data() as Tutorial;
          tutorial.AcStats = status;
          tutorial.BidId = adrsBid.bids; // Update bids
          this.tutorialsRef.doc(doc.id).update(tutorial);
        });
      }).catch(error => {
        console.error('Error updating AcStats:', error);
      });
    });
  }
  
  
  update(id: string, data: any): Promise<void> {
    return this.tutorialsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.tutorialsRef.doc(id).delete();
  }

  getByField(field: string, value: any): Observable<Tutorial[]> {
    const queryFn: QueryFn = ref => ref.where(field, '==', value);
    return this.db.collection(this.dbPath, queryFn).valueChanges({ idField: 'id' }) as Observable<Tutorial[]>;
  }

  addFormConfiguration(formConfig: any) {
    // Assuming 'forms' is the collection in Firestore where you want to store form configurations
    return this.db.collection('forms').add({
      formName: formConfig.formName,
      formFields: formConfig.formFields,
      status: 'pending', // Add status and other fields as needed
      comments: '',
    });
  }

  addAddress(address: string, defaultAmount: number = 0): Promise<any> {
    return this.db.collection('auctions').add({
      address,
      amount: defaultAmount
    });
  }

  updateAmountByAddress(address: string, newAmount: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.collection('auctions', ref => ref.where('address', '==', address))
        .get()
        .toPromise()
        .then(querySnapshot => {
          if (querySnapshot && querySnapshot.size > 0) {
            querySnapshot.forEach(doc => {
              const docRef = doc.ref;
              const data = doc.data() as AuctionData | undefined;
              if (data) {
                const currentAmount = data.amount || 0;
                const updatedAmount = currentAmount + newAmount;
                docRef.update({ amount: updatedAmount })
                  .then(() => resolve())
                  .catch(error => reject(error));
              } else {
                reject(new Error('No data found for the document.'));
              }
            });
          } else {
            reject(new Error('No auction found with the given address.'));
          }
        })
        .catch(error => reject(error));
    });
  }
  
  

  startAuctionCycle(auctionId: string, initialMinimumBid: number): Observable<number> {
    return timer(0, 5000).pipe(
      switchMap(() => this.db.collection('auctions').doc(auctionId).snapshotChanges()),
      map(auctionDoc => {
        const data: AuctionData = auctionDoc.payload.data() as AuctionData;
        const currentAmount: number = data?.amount || initialMinimumBid;
        return currentAmount;
      })
    );
  }

  createOrUpdate(tutorial: Tutorial): any {
    // If the tutorial has an ID, check if it exists
    if (tutorial.id) {
      return  this.tutorialsRef.doc(tutorial.id).update(tutorial);
    } else {
      // If tutorial does not have an ID, simply create a new one
      return this.create(tutorial);
    }
  }

}
