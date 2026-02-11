# Development Setup (React)

This project uses **React**. This guide explains how to set up the project locally and what each required dependency does.

---

## Prerequisites

Before running the project, make sure **Node.js** is installed on your machine. Node.js includes `npm`, which is required to install dependencies.

### Check if Node.js is installed
Run the following commands in your terminal:

### 1. Check for Node.js
```bash
node -v
npm -v
```
checks if you have the environment needed to run JavaScript projects. If numbers appear, you are ready.

### 2. Clone the repository
```bash
cd mirrulations-website
```
Moves your terminal's focus into the project directory so you can interact with the files.

### 3. Install dependecies
```bash
npm install
```
Reads the package.json file and downloads all the external libraries (packages) required to make the website work.

### 4. Install React Core
```bash
npm install react react-dom react-router-dom
```
Explicitly installs the three pillars of this app:

    react: The UI engine.

    react-dom: Renders the code to the web browser.

    react-router-dom: Enables clicking links to go to different pages.

### 5. Launch Development Server
```bash
npm run dev
```
Starts a local web server. It will provide a link (usually http://localhost:5173) that you can open in your browser to see the live site.