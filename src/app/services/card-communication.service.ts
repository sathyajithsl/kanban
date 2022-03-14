import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardCommunicationService {
  public cardData = new BehaviorSubject<any>(null);
  constructor() {}
  public shareCardDetails(cardDetails: any) {
    this.cardData.next(cardDetails);
  }
}
