import { createHashHistory } from 'history';
import Library from '../library';
const history = createHashHistory();
const library = new Library();

export {
  history,
  library
};