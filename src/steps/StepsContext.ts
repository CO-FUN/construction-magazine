import { createContext } from 'react';

import { GenerationStepState } from './types';

export const StepsContext = createContext<{
  moveToStep: (newState: GenerationStepState) => void;
}>({
  moveToStep: () => {},
});
