import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-number',
  templateUrl: './total-number.component.html',
  styleUrl: './total-number.component.css'
})
export class TotalNumberComponent {


  @Input() count: number = 0;
  //@Input() txt: string = "";
}
