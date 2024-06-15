import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';
import { Country } from '../../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit, OnDestroy {

  // Liste des participations d'un pays
  participations!: Participation[];
  // Liste des pays
  countries!: Country[];
  // Un pays spécifique
  country!: Country;
  // Données pour les labels du graphique
  labeldata: number[] = [];
  // Données réelles pour le graphique
  realdata: number[] = [];
  // Couleurs pour les barres du graphique
  colordata: string[] = [];
  // Somme totale des médailles
  somme = 0;
  // Nombre total d'athlètes
  numAthlete = 0;
  // Nombre total de participations
  totalEntries = 0;
  // Référence au graphique
  private chart: Chart | undefined;
  // Styles prédéfinis passés en entrée
  @Input() preStyles: { [key: string]: string | number } = {};

  // Constructeur avec injection des services nécessaires
  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private location: Location) { }

  // Méthode appelée lorsque le composant est détruit
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Détruit le graphique s'il existe
    }
  }

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']); // Récupère l'ID du pays à partir des paramètres de la route
    this.getCountryParticipations(id); // Appelle la méthode pour obtenir les participations du pays
  }

  // Méthode pour obtenir les participations d'un pays
  getCountryParticipations(id: number) {
    this.olympicService.getCountryById(id).subscribe(c => {
      if (c) {
        this.country = c; // Assigne le pays récupéré
        this.participations = c.participations; // Assigne les participations du pays
        if (this.participations != null) {
          // Pour chaque participation, met à jour les données pour le graphique
          this.participations.map(p => {
            this.labeldata.push(p.year);
            this.realdata.push(p.medalsCount);
            this.colordata.push(this.getRandomColor());
            this.somme += p.medalsCount; // Calcule la somme totale des médailles
            this.numAthlete += p.athleteCount; // Calcule le nombre total d'athlètes
            this.totalEntries = this.participations.length; // Calcule le nombre total de participations
          });
          this.RenderChart(this.labeldata, this.realdata, this.colordata); // Rend le graphique
        }
      }
    });
  }

  // Génère une couleur aléatoire
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Méthode pour rendre le graphique
  RenderChart(labeldata: number[], valueData: number[], colordata: any) {
    const myChar = new Chart('barchart', {
      type: 'bar',
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
        // Options du graphique
      }
    });
  }

  // Méthode pour revenir à la page précédente
  back(): void {
    this.location.back();
  }
}