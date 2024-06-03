import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Participation } from '../models/Participation';
import { Country } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<Participation[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  // getCountryById(id: number): Observable<Country> {
  //   const url = `${this.olympicUrl}/${id}`;
  //   return this.http.get<Country>(url);
  // }

  getCountryById(id: number): Observable<Country | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map(countries => countries.find(country => country.id === id)),
      catchError(this.handleError<Country | undefined>('getCountryById'))
    );
  }



  getOlympicsById(id: number): Observable<Participation | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map(countries => {
        for (const country of countries) {
          const participation = country.participations.find(p => p.id === id);
          if (participation) {
            return participation;
          }
        }
        return undefined;
      }),
      catchError(this.handleError<Participation | undefined>('getOlympicsById'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log to console
      return of(result as T); // Return an empty result to keep the app running
    };
  }


}
