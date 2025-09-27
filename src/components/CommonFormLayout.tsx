import React, { FormEventHandler, ReactNode } from 'react';

// Tailwind CSS used for layout and typography

interface CommonFormLayoutProps {
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLDivElement> &
    FormEventHandler<HTMLFormElement>;
}

export const CommonFormLayout = ({
  children,
  onSubmit,
}: CommonFormLayoutProps) => (
  <form
    className="w-full flex flex-col gap-6"
    onSubmit={onSubmit}
    autoComplete="off"
  >
    <div className="flex flex-col gap-4">{children}</div>
  </form>
);
