import NextImage from 'next/image';
import { useContext } from 'react';

// Tailwind CSS used for layout and typography

import { StepsContext } from './StepsContext';
import { RejectedResult, Steps } from './types';

export const ErrorStep = ({
  failedResults,
}: {
  failedResults: Pick<RejectedResult, 'reason'>[];
}) => {
  const { moveToStep } = useContext(StepsContext);

  return (
  <div className="flex flex-col items-center my-24 w-full">
  <div className="w-full flex flex-col items-center text-center">
        <NextImage
          src="/Signs.svg"
          width={120}
          height={120}
          alt="Signs next the the road"
        />
  </div>
  <div className="w-full flex flex-col items-center text-center mt-6">
  <h2 className="text-xl font-bold text-red-500 mb-2">Failed to generate article</h2>
  </div>
  <div className="w-full flex flex-col items-center text-center mt-4">
        <p className="text-lg text-gray-700 font-semibold">
          {failedResults?.map(
            (failedResult) =>
              `Article number - ${
                failedResult.reason.index + 1
              }, failed due to ${failedResult.reason.error}`
          )}
        </p>
  </div>
  <div className="w-full flex flex-col items-center text-center mt-3">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg mt-3"
          onClick={() => moveToStep({ step: Steps.Form })}
        >
          Try again
        </button>
  </div>
  </div>
  );
};
