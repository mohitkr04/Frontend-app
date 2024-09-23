# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Features
- Base UI using react.js 
- Feature 2
- Feature 3

## Installation

```bash
git clone https://github.com/mohitkr04/Frontend-app.git
cd Frontend-app
npm install
npm run dev
```

## Docker Setup

To run the application using Docker:

1. Build the Docker image:
   
   ```docker build -t Frontend-app .```
   

2. Run the Docker container:
   
   ```docker run -p 3000:3000 Frontend-app```
   

This will start the application in a Docker container, accessible at http://localhost:3000.
