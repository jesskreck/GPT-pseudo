/// <reference types="vite/client" />


//The following tells TypeScript that any file with the .jsx extension should be treated as a module, and that it should accept any value as the default export.
declare module "*.jsx" {
  const value: any;
  export default value;
}