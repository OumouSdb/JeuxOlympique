import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OlympicService } from '../core/services/olympic.service';
import { Participation } from '../core/models/Participation';
import { Country } from '../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)
import { Location } from '@angular/common';



@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {

  participations!: Participation[];
  countries!: Country[];
  country1!: Country;
  labeldata: number[] = [];
  realdata: number[] = [];
  colordata: string[] = [];
  somme = 0;
  numAthlete = 0;
  totalEntries = 0;


  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private location: Location) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.getCountryParticipations(id);

  }

  getCountryParticipations(id: number) {

    this.olympicService.getCountryById(id).subscribe(country => {
      if (country) {
        this.country1 = country;
        this.participations = country.participations;
        if (this.participations != null) {
          this.participations.map(p => {
            this.labeldata.push(p.year)
            this.realdata.push(p.medalsCount)
            this.colordata.push(this.getRandomColor());
            this.somme += p.medalsCount;
            this.numAthlete += p.athleteCount;
            this.totalEntries = this.participations.length
          })

          this.RenderChart(this.labeldata, this.realdata, this.colordata)
        }
      }
    })

  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
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

      }
    })
  }

  back(): void {
    this.location.back();
  }
}