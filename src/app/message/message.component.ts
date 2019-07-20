import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { FirebaseService } from '../firebase.service';
import { Customer } from '../models/customer.model';
import { Message } from '../models/message.model';

import swal from 'sweetalert2';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  public customer = '';
  public desc = '';
  public customers: Array<Customer>;

  private messages: Array<Message>;
  private notification;

  constructor(
    private firebaseService: FirebaseService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.firebaseService.customersData.subscribe(c => {
      this.customers = c;
    });
    this.firebaseService.messagesData.subscribe(m => {
      this.messages = m;
    });
    this.firebaseService.notificationData.subscribe(c => {
      this.notification = c;
    });
  }

  public async send(): Promise<any> {
    const customer = this.customers.find(c => c.email === this.customer);
    const data: Message = {
      email: customer.email,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      desc: this.desc,
      read: false,
      id: 1,
      name: customer.name,
      surname: customer.surname,
      url: customer.imageUrl
    };
    if (this.messages.length > 0) {
      data.id = this.messages[this.messages.length - 1].id + 1;
    }
    this.messages.push(data);
    await this.firebaseService.getDataBaseRef('messages').set(this.messages);

    if (!this.notification) {
      this.notification = {
        ...this.notification,
        date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        messages: 1
      };
    } else {
      if (!this.notification.evaluations) {
        this.notification = {
          ...this.notification,
          date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          messages: 1
        };
      } else {
        this.notification.messages += 1;
        this.notification.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
    }
    await this.firebaseService.getDataBaseRef('notification').set(this.notification);
    swal.fire('Nowa Wiadomośc', 'Wiadomość została wysłana!', 'success');
  }

}
