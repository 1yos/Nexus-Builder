import React, { createContext, useContext } from 'react';

export const CMSContext = createContext<any | null>(null);

export function useCMSContext() {
  return useContext(CMSContext);
}
