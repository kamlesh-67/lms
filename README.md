# LMD - Carrier Operations Portal

A comprehensive Last Mile Delivery (LMD) management portal for Emirates Logistics Express.

## Features

- **Dashboard**: Overview of operations, stats, and recent activities.
- **Shipment Management**: Create, view, and manage shipments.
- **Pickup Management**: Schedule and assign pickups.
- **Tracking**: Real-time shipment tracking and exception management.
- **Returns**: Handle reverse logistics and RTOs.
- **Documents**: Generate manifests and print labels.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components and module-specific components.
- `store/`: Redux store configuration and slices.
- `lib/`: Utility functions and API configuration.
