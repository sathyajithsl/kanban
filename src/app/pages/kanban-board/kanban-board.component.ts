import { Component, OnInit } from '@angular/core';
import { CardCommunicationService } from 'src/app/services/card-communication.service';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Task> | undefined;
  private itemDoc: AngularFirestoreDocument<Task> | undefined;
  items: Observable<any[]> | undefined;
  item: Observable<any> | undefined;
  todo: Task[] = [];
  constructor(
    private readonly cardCommunicationService: CardCommunicationService,
    private afs: AngularFirestore
  ) {
    this.itemsCollection = afs.collection<Task>('task-list');

    this.items = this.itemsCollection.snapshotChanges();

    this.items
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Task;
            const trackingId = a.payload.doc.id;
            return { trackingId, ...data };
          })
        )
      )
      .subscribe((x) => {
        //console.log(x);
        this.todo = [...x];
        this.filterSets();
      });
  }
  started: Task[] = [];
  inprogress: Task[] = [];
  completed: Task[] = [];
  accepted: Task[] = [];
  movingTask: any = {
    id: '',
    title: '',
    description: '',
    status: '',
    trackingId: '',
  };
  ngOnInit(): void {
    this.filterSets();
    this.cardCommunicationService.cardData.subscribe((cardData: any) => {
      if (cardData !== null) {
        console.log('A');
        const newCard = { id: this.generateId(), ...cardData };
        this.addNewCard(newCard);
        //this.kanbanCrudService.addData(newCard);
      }
    });
  }

  public generateId() {
    return 'id' + Math.random().toString(16).slice(2);
  }
  private addNewCard(task: Task) {
    this.itemsCollection?.add(task);
    //no need to add to corresponding listsince subscription is working
    //this.addToSpecificGroup(task);
  }
  private addToSpecificGroup(task: Task) {
    if (task.status === 'started') {
      this.started.push(task);
    }
    if (task.status === 'inprogress') {
      this.inprogress.push(task);
    }
    if (task.status === 'completed') {
      this.completed.push(task);
    }
    if (task.status === 'accepted') {
      this.accepted.push(task);
    }
  }
  private resetGroups() {
    this.started = [];
    this.inprogress = [];
    this.completed = [];
    this.accepted = [];
  }
  private filterSets() {
    this.resetGroups();
    this.todo.forEach((task) => {
      this.addToSpecificGroup(task);
    });
  }
  public dragStart(dd: any) {
    console.log(dd);
    this.movingTask = { ...dd };
  }

  public drop(event: any) {
    const startStatus = this.movingTask.status;
    const endStatus = event.currentTarget.id;
    this.startMoving(startStatus);
    this.endMoving(endStatus);
  }
  private startMoving(startStatus: string) {
    let pos = -1;
    if (startStatus === 'started') {
      pos = this[startStatus].findIndex((x) => this.movingTask.id === x.id);
      this[startStatus].splice(pos, 1);
    }
    if (startStatus === 'inprogress') {
      console.log(this.inprogress);
      pos = this[startStatus].findIndex((x) => this.movingTask.id === x.id);
      this[startStatus].splice(pos, 1);
    }
    if (startStatus === 'completed') {
      console.log(this.completed);
      pos = this[startStatus].findIndex((x) => this.movingTask.id === x.id);
      this[startStatus].splice(pos, 1);
    }
    if (startStatus === 'accepted') {
      console.log(this.accepted);
      pos = 0;
      this[startStatus].splice(pos, 1);
    }
  }
  private endMoving(endStatus: string) {
    this.movingTask.status = endStatus;
    console.log(this.movingTask);
    this.itemDoc = this.afs.doc<Task>(
      'task-list/' + this.movingTask.trackingId
    );
    this.itemDoc.update(this.movingTask);
  }
  cardDetailsToRemove(event: any) {
    console.log(event);
    this.itemDoc = this.afs.doc<Task>('task-list/' + event.trackingId);
    this.itemDoc.delete();
  }
}
