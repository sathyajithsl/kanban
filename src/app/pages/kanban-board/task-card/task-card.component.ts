import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() cardDetails: any;
  @Output() emittedCardDetails = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  public deletedCardData(cardDetails: any) {
    this.emittedCardDetails.emit(cardDetails);
  }
}
