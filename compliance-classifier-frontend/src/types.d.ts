// Global type declarations to fix TypeScript errors

// DOM types
interface Window {
  indexedDB: IDBFactory;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

interface Navigator {
  onLine: boolean;
}

interface Document {
  // Add any document properties used in the application
}

interface Console {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

// Global objects
declare const window: Window;
declare const document: Document;
declare const console: Console;
declare const navigator: Navigator;

// ES types
interface Array<T> {
  includes: (item: T) => boolean;
  filter: (predicate: (value: T) => boolean) => T[];
  some: (predicate: (value: T) => boolean) => boolean;
  push: (...items: T[]) => number;
}

interface String {
  toLowerCase: () => string;
  toString: () => string;
  replace: (searchValue: string | RegExp, replaceValue: string) => string;
}

interface Number {
  toString: () => string;
}

interface Promise<T> {
  then: <TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>) => Promise<TResult>;
  catch: <TResult>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>) => Promise<T | TResult>;
}

// Global constructors
declare const Date: {
  new(): Date;
  new(value: number | string): Date;
  now(): number;
  prototype: Date;
};

declare const Math: {
  random(): number;
  floor(x: number): number;
  min(...values: number[]): number;
  max(...values: number[]): number;
};

declare const Array: {
  from<T, U>(arrayLike: ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): U[];
};

declare const JSON: {
  stringify(value: any): string;
  parse(text: string): any;
};

declare const Error: {
  new(message?: string): Error;
};

declare const Boolean: {
  new(value?: any): Boolean;
};

declare const Promise: {
  new<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
  reject<T = never>(reason?: any): Promise<T>;
};

// File API
interface File {
  name: string;
  type: string;
  size: number;
}

interface FormData {
  append(name: string, value: string | Blob, fileName?: string): void;
}

declare const File: {
  new(bits: BlobPart[], name: string, options?: FilePropertyBag): File;
};

declare const FormData: {
  new(): FormData;
};

declare const Blob: {
  new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};

// IndexedDB
interface IDBDatabase {
  createObjectStore(name: string, options?: IDBObjectStoreParameters): IDBObjectStore;
  transaction(storeNames: string | string[], mode?: IDBTransactionMode): IDBTransaction;
}

interface IDBOpenDBRequest extends IDBRequest {
  onupgradeneeded: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null;
}

declare const IDBDatabase: {
  new(): IDBDatabase;
};

declare const IDBOpenDBRequest: {
  new(): IDBOpenDBRequest;
};