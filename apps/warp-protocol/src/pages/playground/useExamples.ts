import astro from './examples/astro.txt';
import eris from './examples/eris.txt';
import simulate from './examples/simulate.txt';

export const useExamples = () => {
  return {
    astro: astro as string,
    eris: eris as string,
    simulate: simulate as string,
  };
};
