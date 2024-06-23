import { Component, OnInit } from '@angular/core';
import { OlympicService } from './core/services/olympic.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {
    // Charge les données initiales nécessaires pour le composant en appelant `loadInitialData`
    // Utilise `pipe(take(1))` pour ne prendre qu'une seule émission de l'observable
    // Cela signifie que l'observable se complétera après sa première émission de données, 
    // garantissant que nous ne nous abonnons qu'une seule fois et évitons des appels répétés.
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}
