import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeopleService, Pessoa, Resultado } from './services/people.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap, concatMap, debounceTime, distinctUntilChanged  } from 'rxjs/operators';
import { converterPessoa } from './shared/rsjx-operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  pessoas: Pessoa[] = [];
  count: number = 0;
  next: string = '';
  previous: string = '';
  totalPessoas: number = 0;
  carregarMais$: BehaviorSubject<string> = new BehaviorSubject<string>(this.next);
  subscription = new Subscription();

  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {

    this.subscription.add(this.carregarMais$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        concatMap((url) => this.peopleService.getPessoas(url)),
        tap(
          (resp) => {
            this.count = resp.count;
            this.next = resp.next;
            this.previous = resp.previous;
          }
        ),
        converterPessoa(),
      )
      .subscribe({
        next: pessoa => this.adicionarPessoa(pessoa),
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    );
  }

  private adicionarPessoa(pessoa: Pessoa) {
    this.pessoas.push(pessoa);
    this.totalPessoas++;
  }

  carregarMais() {
    if (this.next) {
      this.carregarMais$.next(this.next);
    }
  }

  ngOnDestroy(): void {
    this.carregarMais$.complete();
    this.subscription.unsubscribe();
  }

}





