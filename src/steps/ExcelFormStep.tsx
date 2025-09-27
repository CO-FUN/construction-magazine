import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


import { SupportedLanguageValues } from '../utils/constants';
import { handleExcelUpload } from '../utils/excelUtil';
import { inputDataDESchema, inputDataITSchema } from '../utils/validation';
import { StepsContext } from './StepsContext';
import { InputDataDE, InputDataIT, Steps } from './types';

const ExcelFormStep = ({ initialConfig }: { initialConfig: any }) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<{
    excelValues: InputDataIT[] | InputDataDE[];
  }>({
    values: {
      ...initialConfig,
      excelValues: [],
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        excelValues: yup.lazy((values) => {
          return values.length > 0 &&
            values[0]?.language === SupportedLanguageValues.IT
            ? inputDataITSchema.required()
            : inputDataDESchema.required();
        }),
      })
    ),
  });
  const excelData = watch('excelValues');
  const { moveToStep } = useContext(StepsContext);

  // delete excel data
  const handleExcelDataDelete = () => {
    setValue('excelValues', []);
    clearErrors('excelValues');
  };

  //handle excel change
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const { errorMessages, transformedExcelData } =
        await handleExcelUpload(event);
      if (errorMessages) {
        setError('excelValues', {
          type: 'onChange',
          message: errorMessages,
        });
      } else {
        clearErrors('excelValues');
        setValue('excelValues', transformedExcelData, {
          shouldValidate: true,
        });
      }
    }
  };

  return (
    <form className="my-24" onSubmit={handleSubmit(({ excelValues }) => {
      moveToStep({
        step: Steps.Generating,
        data: excelValues,
        any: {},
      });
    })}>
      <h2 className="text-3xl font-bold mb-4">Multiple Articles Generator</h2>
      {excelData?.length === 0 && (
        <p className="text-lg text-gray-700 mt-6">Please upload excel file to generate multiple articles</p>
      )}
      <div className="space-y-6 my-2">
        {excelData?.length === 0 ? (
          <div className="w-full">
            <div className="w-full">
              <div className={errors.excelValues ? 'border border-dashed border-red-500 p-4 rounded' : 'border border-dashed border-gray-300 p-4 rounded bg-white'}>
                <label htmlFor="excel" className="w-full flex flex-col items-center cursor-pointer">
                  <input
                    {...register('excelValues')}
                    onChange={(event) => handleFileUpload(event)}
                    type="file"
                    id="excel"
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                  />
                  <svg className="w-10 h-10 text-purple-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h3l-4 4-4-4h3z" />
                  </svg>
                  <span className="text-md text-purple-700 text-center mt-2">Upload the excel file</span>
                </label>
              </div>
              {errors.excelValues && (
                <span className="text-sm text-red-500">{errors.excelValues?.message}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <p className="text-lg">The excel file has been successfully uploaded!</p>
            <button type="button" className="bg-red-600 text-white px-4 py-2 rounded ml-2" onClick={handleExcelDataDelete}>
              Delete Excel Data
            </button>
          </div>
        )}
        <div className="w-full">
          <div className="flex justify-start mt-6">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg"
              disabled={!isValid || excelData?.length === 0}
              type="submit"
            >
              Generate content
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ExcelFormStep;
