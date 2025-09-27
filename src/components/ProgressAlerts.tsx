
import React, { ReactNode } from 'react';
import { ProgressMessage } from '../steps/types';

const ProgressAlerts = ({
  progressMessages,
  children,
}: {
  progressMessages: ProgressMessage[];
  children?: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <div className="w-full flex flex-col items-center">
        {children}
        <div className="mt-8 w-full flex flex-col gap-3">
          {progressMessages.map((progressMessage, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 p-4 rounded-xl shadow-sm border text-left w-full transition-all
                ${progressMessage.status === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                  progressMessage.status === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                  'bg-blue-50 text-blue-800 border-blue-200'}
              `}
            >
              <span className="text-xl">
                {progressMessage.status === 'success' && '✅'}
                {progressMessage.status === 'error' && '❌'}
                {progressMessage.status === 'info' && '💬'}
              </span>
              <span className="font-medium">{progressMessage.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressAlerts;
