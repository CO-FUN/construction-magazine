import { useContext, useEffect, useRef, useState } from 'react';

import ProgressAlerts from '../components/ProgressAlerts';
import { generateContent } from '../utils/generateContentUtil';
import { useProgressMessages } from '../utils/useProgressUpdate';
import { StepsContext } from './StepsContext';
import {
  InputDataDE,
  InputDataIT,
  Steps,
  SuccessFormState,
} from './types';

const GeneratingStep = ({
  config,
  data,
}: {
  config: any;
  data: InputDataIT[] | InputDataDE[] | [InputDataIT | InputDataDE];
}) => {
  const [currentCost, setCurrentCost] = useState(0);
  const { progressUpdate, progressMessages } = useProgressMessages();
  const { moveToStep } = useContext(StepsContext);
  const hasGeneratedContent = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      // Perform actions before the component unloads
      event.preventDefault();
      event.returnValue = true;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!hasGeneratedContent.current) {
      hasGeneratedContent.current = true;
      generateContent(data, config, progressUpdate, setCurrentCost).then(
        async (result) => {
          const {
            successfulResults: successChatResults,
            failedResults: failedChatResults,
          } = result;
          const successStepState: SuccessFormState = {
            step: Steps.Success,
            result: {
              cost: result.cost,
              time: result.time,
              failedResults: [...failedChatResults],
              successfulResults: [...successChatResults],
            },
          };
          moveToStep(successStepState);
        }
      );
    }
  }, []);

  return (
    <ProgressAlerts progressMessages={progressMessages}>
      <div className="text-lg font-semibold text-gray-800 mt-4">Generating an article</div>
      <div className="my-6" />
      <div className="text-md text-gray-600 mb-2">This can take up to few minutes...</div>
      <div className="text-md text-gray-600">{`Current cost: $${currentCost.toFixed(3)}`}</div>
    </ProgressAlerts>
  );
};

export default GeneratingStep;
