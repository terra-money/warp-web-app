import astro from './examples/astro.txt';
import eris from './examples/eris.txt';

export const useExamples = () => {
  return {
    astro: astro as string,
    eris: eris as string,
  };
};
