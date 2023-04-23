import { switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { tap, debounceTime, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import Pessoa from 'src/app/shared/interfaces/pessoa';
import { converterPessoa } from 'src/app/shared/rxjs/operators';
import { BuscaService } from 'src/app/services/busca.service';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css']
})
export class BuscaComponent implements OnInit {

  constructor(private buscaService: BuscaService) { }

  pesquisaTexto = new FormControl('');
  pessoasEncontradas: Pessoa[] = [];
  totalEncontrados: number = 0;

  ngOnInit(): void {
    this.pesquisaTexto.valueChanges
      .pipe(
        debounceTime(300), // espera 300ms para emitir o valor
        map(value => value ? value.trim() : ''), // remove espaços em branco
        filter(nome => nome.length > 2), // filtra nomes com menos de 3 caracteres
        distinctUntilChanged(), // ignora valores repetidos
        tap(() => { // limpa os valores anteriores
          this.pessoasEncontradas = [];
          this.totalEncontrados = 0;
        }),
        switchMap(nome  => this.buscaService.buscar(nome)), // cancela a busca anterior e busca os dados na api com novo valor
        converterPessoa() // converte os dados para o tipo Pessoa
      )
      .subscribe(pessoa => this.armazenarPessoa(pessoa));
  }

  private armazenarPessoa(pessoa: Pessoa) {
    this.totalEncontrados++;
    this.pessoasEncontradas.push(pessoa);
  }
}
