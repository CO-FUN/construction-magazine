import { useContext } from 'react';

// Tailwind CSS used for layout and typography

import { StepsContext } from './StepsContext';
import { RejectedResult, Steps } from './types';
import { MagazineArticle } from '../components/MagazineArticle';

const SuccessStep = ({
  cost,
  time,
  failedResults,
  successfulResults,
}: {
  cost: number;
  time: number;
  failedResults: Pick<RejectedResult, 'reason'>[];
  successfulResults: any[]; // Added successfulResults to props
}) => {
  const { moveToStep } = useContext(StepsContext);

  const articleData = successfulResults?.map((result) => ({
    heading: result.mergedData?.heading || [],
    content: result.mergedData?.content || [],
    body: result.mergedData?.body || [],
    tags: result.mergedData?.tags || [],
    meta_data: result.mergedData?.meta_data || [],
  }))[0] || {};

  return (
    <div className="flex flex-wrap w-full">
      <div className="w-full md:w-1/3 px-4">
        <h2 className="text-3xl font-bold mt-4 mb-2">Article generated</h2>
        <p className="text-lg text-gray-700 mt-2">The article is successfully created.</p>
        <p className="text-md flex mt-2">Execution time: <span className="font-semibold mx-2">{`${Math.floor(time / 60)}min ${(time % 60).toString().padStart(2, '0')}s`}</span></p>
        <p className="text-md flex mt-2">Estimated cost of generation: <span className="font-semibold mx-2">{`$${cost.toFixed(3)}`}</span></p>
        {failedResults.length > 0 && (
          <p className="text-md flex mt-2 flex-wrap">You may still need to check/retry the other failed articles: <span className="font-semibold mx-2">{failedResults.map((failedResult) => `Article number - ${failedResult.reason.index + 1}, failed due to ${failedResult.reason.error}`)}</span></p>
        )}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg mt-8"
          onClick={() => moveToStep({ step: Steps.Form })}
        >
          Create new article
        </button>
      </div>
      <div className="w-full md:w-2/3 px-4">
        <MagazineArticle data={articleData} />
      </div>
    </div>
  );
};

export default SuccessStep;
