# Leaky Bits

## Overview

A web-based SQL query runner that allows you to execute set of predefined SQL queries against a mock api.
This mainly focuses on being able to render the results of the queries in a way that is easy to read and understand, and
do operation on top of existing results.

## Features

- pagination
- sorting
- filter
- export [csv, xlsx]
- Resizable Table

## Toolchain

|        For         |                           I used                           |
|:------------------:|:----------------------------------------------------------:|
| Frontend Framework |               [React](https://reactjs.org/)                |
|     UI Library     |              [AntDesign](https://ant.design)               |
|  State Management  |          [Redux Saga](https://redux-saga.js.org)           |
|    XLSX Export     |         [XLSX](https://www.npmjs.com/package/xlsx)         |
|  Resizable Layour  | [react-reflex](https://www.npmjs.com/package/react-reflex) |

## Page Load Metrics
![](https://i.ibb.co/dWwHV1F/Screenshot-2022-05-31-at-12-37-32-AM.png)
## Optimizations and Improvements

- Made use of `useCallback` to prevent unnecessary re-renders
- Moved `<InterativeTable/>` component from <App/> to `<DataViewer/>` component, which stopped the re-rendering of the
  entire app when paginating or sorting.
- Added resolutions to package.json that helped with performance increase of AntD Table, preventing unnecessary rerender
  when
  hovering.[67e8a6565e2a4b6aabbb13960653f2709e0a11b5](https://github.com/NikhilCodes/leaky-bits/commit/67e8a6565e2a4b6aabbb13960653f2709e0a11b5)
- Used `React.memo` on Table Control component to prevent unnecessary re-renders.
  - Before: ![Image](https://i.ibb.co/nwFb3sC/Screenshot-2022-05-29-at-12-15-26-AM.png)
  - After: ![Image](https://i.ibb.co/2FqcP3D/Screenshot-2022-05-29-at-12-11-21-AM.png)
- Applied code-splitting and lazy loading to `<InteractiveTable/>` component, which improves page load time.
  - Before: ![Image](https://i.ibb.co/crLyMkk/Screenshot-2022-05-31-at-12-42-19-AM.png)
  - After: ![Image](https://i.ibb.co/R4MXWCS/Screenshot-2022-05-31-at-12-41-30-AM.png)
