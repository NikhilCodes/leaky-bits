# Leaky Bits

## Overview

A web-based SQL query runner that allows you to execute set of predefined SQL queries against a mock api.
This mainly focuses on being able to render the results of the queries in a way that is easy to read and understand, and
do operation on top of existing results.

## Features

- pagination
- sorting
- filtering
- search
- export
- download
- edit
- delete
- create

## Toolchain

|        For         |                            I used                            |
|:------------------:|:------------------------------------------------------------:|
| Frontend Framework |                [React](https://reactjs.org/)                 |
|     UI Library     |               [AntDesign](https://ant.design)                |
|  State Management  |           [Redux Saga](https://redux-saga.js.org)            |
|    XLSX Export     | [npmjs.com/package/XLSX](https://www.npmjs.com/package/xlsx) |  

## Page Load Metrics

## Optimizations and Improvements

- Made use of `useCallback` to prevent unnecessary re-renders
- Moved `<InterativeTable/>` component from <App/>  to `<DataViewer/>` component, which stopped the re-rendering of the
  entire app when paginating or sorting.
- Added resolutions to package.json that helped with performance increase of AntD Table, preventing unnecessary rerender
  when
  hovering.[67e8a6565e2a4b6aabbb13960653f2709e0a11b5](https://github.com/NikhilCodes/leaky-bits/commit/67e8a6565e2a4b6aabbb13960653f2709e0a11b5)
