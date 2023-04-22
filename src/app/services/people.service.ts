import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import Resultado from '../shared/interfaces/resultado';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  url_default = 'https://swapi.dev/api/people/';

  constructor(private http: HttpClient) { }

  getPessoas(url: string): Observable<Resultado> {
    if (url) {
      return this.http.get<Resultado>(url)
        .pipe(
          take(1)
          );
    }
    return this.http.get<Resultado>(this.url_default)
      .pipe(
        take(1)
        );
  }
}
