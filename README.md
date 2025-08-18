# PBS Data Analytics Dashboard

A **modern, interactive analytics dashboard** for real-time monitoring and visualization of a complex automotive paint shop process. Built with TypeScript, React, Vite, and Tailwind CSS, the project visualizes process flows, maintenance, and quality control in a factory context.

---

## Demo

Live at: [pbs-data-analytics.vercel.app](https://pbs-data-analytics.vercel.app)

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

PBS Data Analytics Dashboard enables interactive and real-time monitoring of a full-scale **automotive paint shop workflow**. With advanced UI, it provides process visualization, maintenance insights, and quality control statistics for complex manufacturing environments.

### Key Use Cases:
- Visual process mapping from BIW Storage to final assembly
- Real-time health of each shop stage (status, temp, efficiency, vibration)
- Predictive maintenance timelines for each section
- Live quality control tracking, e.g., coating thickness, cure temp, humidity, gloss
- Quick alerts and warnings for abnormal process or quality conditions

---

## Features

- **Interactive Process Flow:**
  - Drag, pan, and zoom across an SVG-based graphical map
  - Node selection reveals detailed process stats
  - Multi-stage process grouping (pretreatment, ovenlines, booths, final assembly, rework paths)

- **Real-Time Data Simulation:**
  - All process, maintenance, and quality data updates live (simulated)
  - Alerts for any parameters that exceed safe thresholds

- **Maintenance Management:**
  - Predicts next service, last service, and total run-hours for equipment/nodes

- **Quality Control:**
  - CPK/cp calculations and visual indicators for parameters
  - Control charts with statistical trends
  - Historical and real-time data views for each key quality metric

- **Modern UI:**
  - Responsive, clean design
  - Color-coded status (Normal/Warning/Critical)
  - Intuitive panel switching between Overview, Maintenance, and Quality views

---

## Technologies Used
- TypeScript
- React
- Vite
- Tailwind CSS
- lucide-react (icons)

---

## Project Structure

```
main/
├── src/
│   ├── components/         # Dashboard, process map, controls, quality & maintenance panels
│   ├── contexts/           # State management for alerts, data, and process context
│   └── App.tsx             # App entry
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── ...
```

---

## Getting Started

### Requirements
- Node.js 18+
- npm/yarn

### Local Development

```
git clone https://github.com/meraxesism/pbs-data-analytics.git
cd pbs-data-analytics
npm install
npm run dev
```

Open your browser to the local dev server (typically http://localhost:5173).

### Production Build

```
npm run build
```
The build assets can be deployed to Vercel, Netlify, or any static hosting provider.

---

## Usage

- **Process Overview:** Pan/zoom or select process nodes for stats
- **Maintenance:** Switch to maintenance tab to view service needs
- **Quality:** Analyze live quality metrics and control charts

All data is simulated for demo/analytics purposes!

---

## Contributing

Pull requests, issue reports, and suggestions are welcome!

---

## License

This project is open-source under the MIT License.
