import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';
import { Country } from '../../core/models/Olympic';
import { Chart, LogarithmicScale, registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  participants!: Participation[];
  countries!: Country[];
  labeldata: String[] = [];
  realdata: number[] = [];
  colordata: String[] = [];



  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.getAllcountries()

  }

  getAllcountries() {

    this.olympicService.getOlympics().subscribe(result => {
      let somme = 0;
      this.countries = result;
      if (this.countries != null) {
        this.countries.map(c => {
          this.labeldata.push(c.country)
          this.realdata.push(somme)
          this.colordata.push(this.getRandomColor())
          this.olympicService.getOlympicsById(c.id).subscribe(e => {
            somme += e?.medalsCount ?? 0;

          })

        })

        this.RenderChart(this.labeldata, this.realdata, this.colordata)
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

  RenderChart(labeldata: String[], valueData: number[], colordata: any) {
    const myChar = new Chart('piechart', {
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

      }
    })
  }
}
