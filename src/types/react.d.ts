import type { 
  ButtonHTMLAttributes, 
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
  ForwardRefRenderFunction,
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef
} from 'react';

declare module 'react' {
  export * from 'react';
}

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

// Hoặc khai báo cụ thể các type cần dùng
declare module 'react' {
  export type {
    FC,
    ReactNode,
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    SelectHTMLAttributes,
    FormEvent,
    ChangeEvent,
    MouseEvent,
  };
  
  export {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    createContext,
    useContext,
    forwardRef,
  };
} 