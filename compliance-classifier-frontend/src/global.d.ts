// Global type declarations to fix TypeScript errors

// DOM types
declare global {
  interface Window {
    indexedDB: any;
    addEventListener: any;
    removeEventListener: any;
  }

  interface Navigator {
    onLine: boolean;
  }

  interface Document {
    // Add any document properties used in the application
  }

  interface Console {
    log: any;
    error: any;
    warn: any;
    info: any;
  }

  // Global objects
  const window: Window;
  const document: Document;
  const console: Console;
  const navigator: Navigator;

  // ES types
  interface Array<T> {
    includes(item: T): boolean;
    filter(predicate: (value: T) => boolean): T[];
    some(predicate: (value: T) => boolean): boolean;
    push(...items: T[]): number;
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
  }

  interface String {
    toLowerCase(): string;
    toString(): string;
    replace(searchValue: string | RegExp, replaceValue: string): string;
    substring(start: number, end?: number): string;
    substr(start: number, length?: number): string;
    length: number;
  }

  interface Number {
    toString(): string;
  }

  interface Promise<T> {
    then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>): Promise<TResult>;
    catch<TResult>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<T | TResult>;
  }

  // Global constructors
  const Date: {
    new(): Date;
    new(value: number | string): Date;
    now(): number;
    prototype: Date;
  };

  interface Date {
    toISOString(): string;
    setUTCSeconds(sec: number): number;
  }

  const Math: {
    random(): number;
    floor(x: number): number;
    min(...values: number[]): number;
    max(...values: number[]): number;
  };

  const Array: {
    from<T, U>(arrayLike: ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): U[];
  };

  const JSON: {
    stringify(value: any): string;
    parse(text: string): any;
  };

  const Error: {
    new(message?: string): Error;
  };

  const Boolean: {
    new(value?: any): Boolean;
  };

  const Promise: {
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

  const File: {
    new(bits: any[], name: string, options?: any): File;
  };

  const FormData: {
    new(): FormData;
  };

  const Blob: {
    new(blobParts?: any[], options?: any): Blob;
  };

  // IndexedDB
  interface IDBDatabase {
    createObjectStore(name: string, options?: any): any;
    transaction(storeNames: string | string[], mode?: string): any;
  }

  interface IDBOpenDBRequest extends IDBRequest {
    onupgradeneeded: ((this: IDBOpenDBRequest, ev: any) => any) | null;
  }

  interface IDBRequest {
    onsuccess: ((this: IDBRequest, ev: any) => any) | null;
    onerror: ((this: IDBRequest, ev: any) => any) | null;
    result: any;
  }

  const IDBDatabase: {
    new(): IDBDatabase;
  };

  const IDBOpenDBRequest: {
    new(): IDBOpenDBRequest;
  };

  // Add any other missing types here
}

export {};