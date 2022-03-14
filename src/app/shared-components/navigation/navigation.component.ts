import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardCommunicationService } from 'src/app/services/card-communication.service';

interface status {
  name: string;
  code: string;
}
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  constructor(
    private readonly cardCommunicationService: CardCommunicationService
  ) {}

  public items: MenuItem[] = [];
  public statuses: status[] = [];
  public title: string = '';
  public description: string = '';
  public selectedStatus: status = { name: '', code: '' };
  ngOnInit(): void {
    this.items = [
      {
        label: 'Kanban Board',
        routerLink: '/home',
      },
    ];
    this.statuses = [
      { name: 'Started', code: 'started' },
      { name: 'In Progress', code: 'inprogress' },
      { name: 'Completed', code: 'completed' },
      { name: 'Accepted', code: 'accepted' },
    ];
  }
  public createCard() {
    this.cardCommunicationService.shareCardDetails({
      title: this.title,
      description: this.description,
      status: this.selectedStatus.code,
    });
  }
}
