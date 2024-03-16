import astro from './examples/astro.txt';
import eris from './examples/eris.txt';
import simulate from './examples/simulate.txt';
import lion_dao from './examples/lion_dao.txt';

export type Example = {
  name: string;
  code: string;
};

export const useExamples = (): { [key: string]: Example } => {
  return {
    simulate: { name: 'simulate', code: simulate as string },
    eris: { name: 'eris', code: eris as string },
    astro: { name: 'astro', code: astro as string },
    LionDAO: { name: 'LionDAO', code: lion_dao as string },
  };
};
