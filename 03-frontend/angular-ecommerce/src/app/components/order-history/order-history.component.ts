import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;
  private KEY_STORAGE_EMAIL: string = 'userEmailStorage';

  constructor(private orderHitoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    // read the user's email from browser storage
    const theEmail = JSON.parse(this.storage.getItem(this.KEY_STORAGE_EMAIL)!);

    if(theEmail != null && theEmail !== ''){
      // retrieve data from the service
      this.orderHitoryService.getOrderHistory(theEmail).subscribe(
        data => {
          this.orderHistoryList = data._embedded.orders;
        }
      )
    }
    
    
  }

}
