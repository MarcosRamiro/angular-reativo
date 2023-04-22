import { pipe, switchMap, map } from 'rxjs';
import Resultado from '../interfaces/resultado';

export function converterPessoa() {
  return pipe(
    switchMap((resp: Resultado) => resp.results),
    map(person => ({
      name: person.name,
      gender: person.gender,
      height: person.height,
      mass: person.mass,
      hair_color: person.hair_color,
      skin_color: person.skin_color,
      eye_color: person.eye_color
    })
    )
  );
}
