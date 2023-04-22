import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Resultado from '../shared/interfaces/resultado';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaService {

  url_default = 'https://swapi.dev/api/people/?search=';

  constructor(private http: HttpClient) { }

  buscar(nome: string): Observable<Resultado> {
    return this.http.get<Resultado>(this.url_default + nome)
      .pipe(
        take(1)
        );
  }


}
