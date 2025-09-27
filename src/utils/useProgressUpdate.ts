import { useCallback, useState } from 'react';

interface ProgressMessage {
  message: string;
  status: 'info' | 'success';
}

export function useProgressMessages() {
  const [progressMessages, setProgressMessages] = useState<ProgressMessage[]>(
    []
  );
  const progressUpdate = useCallback(
    (message: string, status: 'info' | 'success') => {
      setProgressMessages((items) => {
        const updatedItems = [...items];
        const existingMsgIndex = items.findIndex(
          (item) => item.message === message
        );

        if (existingMsgIndex > -1) {
          // message exists, update only status
          updatedItems[existingMsgIndex] = {
            ...updatedItems[existingMsgIndex],
            status: status,
          };
          return updatedItems;
        } else {
          return [{ message, status }, ...updatedItems]; // new message
        }
      });
    },
    []
  );

  return {
    progressMessages,
    progressUpdate,
  };
}
