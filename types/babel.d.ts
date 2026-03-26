declare module '@babel/standalone';

declare global {
  interface Window {
    renderComponent: (code: string) => void;
  }
}
