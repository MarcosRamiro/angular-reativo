import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, map, switchMap, tap, take } from 'rxjs';

export interface Pessoa {
  name: string;
  gender: string;
  height: number;
  mass: number;
  hair_color: string;
  skin_color: string;
  eye_color: string;
}
export interface Resultado {
  results: Pessoa[];
  count: number;
  next: string;
  previous: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  url_dafault = 'https://swapi.dev/api/people/';

  constructor(private http: HttpClient) { }

  getPessoas(url: string): Observable<Resultado> {
    if (url) {
      return this.http.get<Resultado>(url).pipe(take(1));
    }
    return this.http.get<Resultado>(this.url_dafault).pipe(take(1))
  }
}
