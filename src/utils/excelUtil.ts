import * as XLSX from 'xlsx';

import { InputDataDE, InputDataIT } from '../steps/types';
import { SupportedLanguageValues } from './constants';
import { validationMessages } from './validation';

const transformedExcelDataFR = (
  excelData: (string | number)[][]
): InputDataIT[] => {
  //Mapping between original excel header names and names
  const headerMappingIt: { [key: string]: string } = {
    'Article Name': 'articleName',
    Keywords: 'keywords',
    'Number of Headings': 'numberOfHeadings',
    'Number of FAQ’s': 'numberOfFaq',
    Language: 'language',
    'Minimum Number of words': 'minimumNumberOfWords',
    Tags: 'tags',
  };

  const rowDataIT: InputDataIT = {
    articleName: '',
    keywords: '',
    numberOfHeadings: 0,
    numberOfFaq: 0,
    language: 'it',
    minimumNumberOfWords: 0,
    tags: '',
  };

  return transformExcelDataG(excelData, headerMappingIt, rowDataIT);
};

const transformedExcelDataDE = (
  excelData: (string | number)[][]
): InputDataDE[] => {
  //Mapping between original excel header names
  const headerMappingDE: { [key: string]: string } = {
    'Article Name': 'articleName',
    Keywords: 'keywords',
    Language: 'language',
    Instructions: 'instructions',
    'Target Group': 'targetGroup',
  };
  const rowDataDE: InputDataDE = {
    articleName: '',
    keywords: '',
    language: 'de',
    instructions: '',
    targetGroup: '',
  };

  return transformExcelDataG(excelData, headerMappingDE, rowDataDE);
};

const transformExcelDataG = <T>(
  excelData: (string | number)[][],
  headerMapping: { [key: string]: string },
  initialRowData: T
): T[] => {
  const headerRow = excelData[1];
  const result: T[] = [];
  // Starting from index 2 if header row is at index 1
  for (let i = 2; i < excelData.length; i++) {
    const row = excelData[i];
    let rowData: T;
    if (row.length > 0) {
      rowData = { ...initialRowData };

      // Forming key-value pairs based on the header row {'articleName': value, 'keywords': value, ...}
      headerRow.forEach((key, index) => {
        const mappedKey = headerMapping[key];
        (rowData as any)[mappedKey] =
          row[index] !== undefined ? row[index] : (rowData as any)[mappedKey];
      });

      result.push(rowData);
    }
  }

  return result;
};

//handleFileReader
const handleFileReader = async (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });

//handle excel upload
export const handleExcelUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return {
      errorMessages: '',
      transformedExcelData: [],
    };
  }

  try {
    const data = await handleFileReader(file);
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });
    const isGermanArticle = excelData
      .slice(2)
      .every((data) => data[2] === SupportedLanguageValues.DE);
    const transformedExcelData = isGermanArticle
      ? transformedExcelDataDE(excelData)
      : transformedExcelDataFR(excelData);
    const validation = await validationMessages(transformedExcelData);
    const errorMessages = Object.values(validation.errors)
      .filter((error: any) => error && typeof error === 'object')
      .map((error: any) => {
        const rowNumber = parseInt(error.index.match(/\d+/)![0], 10);
        return `${error.message} in row no:${rowNumber}   `;
      })
      .join(',');

    return { errorMessages, transformedExcelData };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return {
      errorMessages: 'Error reading Excel file',
      transformedExcelData: [],
      isFileInput: false,
    };
  }
};
