import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Participation } from '../models/Participation';
import { Country } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // URL du fichier JSON contenant les données olympiques
  private olympicUrl = './assets/mock/olympic.json';
  // Sujet pour stocker les données des pays olympiques
  private olympics$ = new BehaviorSubject<Country[]>([]);

  // Constructeur avec injection du service HttpClient
  constructor(private http: HttpClient) { }

  // Charge les données initiales depuis le fichier JSON
  loadInitialData(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)), // Met à jour les données du sujet
      catchError((error, caught) => {
        this.olympics$.next([]); // Envoie un tableau vide en cas d'erreur
        return of([]); // Retourne un Observable vide pour continuer le flux
      })
    );
  }

  // Retourne les données des pays olympiques en tant qu'Observable
  getOlympics(): Observable<Country[]> {
    return this.olympics$.asObservable();
  }

  // Retourne les informations d'un pays par son ID
  getCountryById(id: number): Observable<Country | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map(countries => countries.find(country => country.id === id)), // Trouve le pays par son ID
      catchError(this.handleError<Country | undefined>('getCountryById')) // Gère les erreurs
    );
  }

  // Retourne les informations d'une participation par son ID
  getOlympicsById(id: number): Observable<Participation | undefined> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map(countries => {
        for (const country of countries) {
          const participation = country.participations.find(p => p.id === id); // Trouve la participation par son ID
          if (participation) {
            return participation;
          }
        }
        return undefined;
      }),
      catchError(this.handleError<Participation | undefined>('getOlympicsById')) // Gère les erreurs
    );
  }

  // Gère les erreurs de manière générique
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: string): Observable<T> => {
      return of(result as T); // Retourne un résultat vide pour continuer le flux
    };
  }


}
