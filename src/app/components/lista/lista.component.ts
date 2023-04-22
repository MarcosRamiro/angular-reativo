import { distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Subscription, debounceTime, concatMap, tap } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Pessoa from 'src/app/shared/interfaces/pessoa';
import { PeopleService } from 'src/app/services/people.service';
import { converterPessoa } from 'src/app/shared/rxjs/operators';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit, OnDestroy {


  pessoas: Pessoa[] = [];
  count: number = 0;
  next: string = '';
  previous: string = '';
  totalPessoas: number = 0;
  carregarMais$: BehaviorSubject<string> = new BehaviorSubject<string>(this.next);
  subscription = new Subscription();

  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {

    this.subscription.add(
      this.carregarMais$
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
