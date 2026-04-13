import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogBox } from '../dialog-box/dialog-box';


@Component({
  selector: 'app-inventory',
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {

  httpclient = inject(HttpClient)
  productIdToDelete: number = 0;

  private modalService=inject(NgbModal)

  inventory: any[] = [
    // { id: 1, name: 'iPhone 14', category: 'Mobile', price: 999, stock: 25 },
    // { id: 2, name: 'MacBook Air', category: 'Laptop', price: 1200, stock: 10 },
    // { id: 3, name: 'Headphones', category: 'Accessories', price: 150, stock: 0 }
  ];

  searchText = '';
  selectedCategory = '';

  inventorydata = {
    id: 0,
    productName: '',
    category: '',
    price: null,
    stock: null,
  };

  inventoryDetails: any[] = [];

  ngOnInit(){
    this.getInventoryDetails();
  }

  getInventoryDetails(): void {
    let apiurl="https://localhost:7006/api/Inventory"
    this.httpclient.get<any[]>(apiurl).subscribe(data=>{
      this.inventoryDetails = data;
      console.log(this.inventoryDetails);
    });
  }


  onAddProduct(): void {
    let apiurl="https://localhost:7006/api/Inventory"
    
    let httpoptions={
      headers: {
        'Content-Type': 'application/json'
      }
    }
    this.httpclient.post(apiurl, this.inventorydata,httpoptions).subscribe({
      next: v=> console.log(v),
      error: e=> console.error(e),
      complete: () => {
            alert('Form submitted! successfully: ' + JSON.stringify(this.inventorydata));
            this.getInventoryDetails();
            this.ngOnInit();
      }
    });
  }

  openConfirmDialog(){
    this.modalService.open(DialogBox);
  }

  editProduct(item: any): void {
    alert('Edit product: ' + item.name);
  }

  deleteProduct(id: number): void {
    this.productIdToDelete = id;
    console.log(this.productIdToDelete);
    this.httpclient.delete(`https://localhost:7006/api/Inventory/${id}`).subscribe({
      next: v=> console.log(v),
      error: e=> console.error(e),
      complete: () => {
        this.getInventoryDetails();
        // this.ngOnInit();
      }
    });

    // this.inventoryDetails = this.inventoryDetails.filter(item => item.productName !== productName);
    // alert('Product deleted successfully!');
  }
}
