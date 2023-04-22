import Pessoa from "./pessoa";

export default interface Resultado {
  results: Pessoa[];
  count: number;
  next: string;
  previous: string;
}
