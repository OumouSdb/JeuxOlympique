import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';
import { Country } from '../../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';

// Enregistrement des modules Chart.js nécessaires pour la création de graphiques
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Sujet pour gérer les données des pays de manière réactive
  // BehaviorSubject est utilisé ici pour stocker et émettre les données des pays
  private olympicsSubject = new BehaviorSubject<Country[]>([]);

  // Observable qui permet aux autres parties de l'application de s'abonner aux changements des données des pays
  public olympics$: Observable<Country[]> = this.olympicsSubject.asObservable();

  // Observable qui contiendra la liste de tous les pays
  totalOfCountries!: Observable<Country[]>;

  // Tableau pour stocker les participations des pays
  participants!: Participation[];

  // Tableau pour stocker les données des pays
  countries!: Country[];

  // Variable pour stocker les données d'un pays spécifique
  country?: Country;

  // Tableau pour stocker les noms des pays à afficher dans le graphique
  labeldata: String[] = [];

  // Tableau pour stocker les valeurs numériques (nombre de médailles) pour chaque pays dans le graphique
  realdata: number[] = [];

  // Tableau pour stocker les couleurs à utiliser pour chaque pays dans le graphique
  colordata: string[] = [];

  // Set pour stocker les années uniques des Jeux Olympiques (pour éviter les doublons)
  numOfJoS: Set<number> = new Set();

  // Variable privée pour stocker l'objet du graphique Chart.js
  private chart: Chart<any, any, any> | undefined;

  // Booléen pour contrôler l'affichage du graphique
  showChart: boolean = true;

  // Variable pour stocker un message d'erreur éventuel
  error?: string;

  constructor(private olympicService: OlympicService, private router: Router) { }

  // Méthode appelée à l'initialisation du composant
  ngOnInit() {
    // Récupération des données des olympiques et appel de la méthode pour traiter les pays
    this.olympics$ = this.olympicService.getOlympics();
    this.getAllcountries();
  }

  // Méthode appelée à la destruction du composant pour nettoyer les ressources
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Destruction du graphique pour éviter les fuites de mémoire
    }
  }

  // Méthode pour récupérer et traiter les données de tous les pays
  getAllcountries() {
    this.olympicService.getOlympics().subscribe(result => {
      this.countries = result;
      if (this.countries != null) {
        this.countries.map(c => {
          let uniqueColor = false;
          while (!uniqueColor) { // methode qui permet de verifier qu'une couleur est utilisé une seule fois dans le graphique
            const randomColor = this.getRandomColor();
            if (!this.colordata.includes(randomColor)) {
              uniqueColor = true;
              this.colordata.push(randomColor);
            }
          }
          this.labeldata.push(c.country);
          this.olympicService.getCountryById(c.id).subscribe(r => {
            this.country = r;
            let somme = 0;
            this.country?.participations.forEach(e => {
              this.numOfJoS.add(e.year);
              somme += e.medalsCount;
            });
            this.realdata.push(somme);
          });
        });
        // Appel de la méthode pour rendre le graphique avec les données traitées
        this.RenderChart(this.labeldata, this.realdata, this.colordata);
      }
    },
      catchError(error => {
        this.error = 'Une erreur est survenue:' + error; // retourne une erreur à l'utilisateur
        return this.error;
      }));
  }

  // Méthode pour générer une couleur aléatoire
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Méthode pour rendre le graphique avec les données fournies
  RenderChart(labeldata: String[], valueData: number[], colordata: string[]) {
    this.showChart = true; // Affichage du composant graphique

    setTimeout(() => { // Attente pour garantir que le graphique précédent est détruit avant de recréer un nouveau
      if (this.chart) {
        this.chart.destroy(); // Destruction du graphique précédent
      }
      this.showChart = true; // Réaffichage du composant graphique

      const canvasElement = document.getElementById('piechart');
      if (canvasElement) {
        this.chart = new Chart('piechart', {
          type: 'pie',
          data: {
            labels: labeldata,
            datasets: [
              {
                label: '',
                data: valueData,
                backgroundColor: colordata,
              }
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements) => {
              if (elements.length > 0) {
                const index = elements[0].index;
                const country = this.countries[index];
                this.router.navigate([`/details/${country.id}`]); // Navigation vers les détails du pays cliqué
              }
            }
          }
        });
      }
    }, 500); // temps avant affichage du graphique
  }
}
