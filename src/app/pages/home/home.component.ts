import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, take } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';
import { Country } from '../../core/models/Olympic';
import { Chart, registerables } from 'chart.js';
import { Route, Router } from '@angular/router';
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  //public olympics$: Observable<Country> = of([]);// corriger
  private olympicsSubject = new BehaviorSubject<Country[]>([]);
  public olympics$: Observable<Country[]> = this.olympicsSubject.asObservable();
  totalOfCountries!: Observable<Country[]>;
  participants!: Participation[];
  countries!: Country[];
  country?: Country;
  labeldata: String[] = [];
  realdata: number[] = [];
  colordata: String[] = [];
  numOfJoS!: number;


  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit() {
    //this.totalOfCountries = this.olympicService.getAllCountries()
    this.olympics$ = this.olympicService.getOlympics();
    this.getAllcountries()

  }



  getAllcountries() {
    this.olympicService.getOlympics().subscribe(result => {
      this.countries = result;
      if (this.countries != null) {
        this.countries.map(c => {
          this.labeldata.push(c.country)
          this.colordata.push(this.getRandomColor())
          this.olympicService.getCountryById(c.id).subscribe(r => {
            this.country = r;

            let somme = 0;
            this.country?.participations.forEach(e => {
              this.numOfJoS++;


              somme += e.medalsCount
            })

            this.realdata.push(somme)

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
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const country = this.countries[index];
            this.router.navigate([`/details/${country.id}`]);
          }
        }

      }
    })
  }


}
