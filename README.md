# XYZ Business Asset Management System

A comprehensive web application for managing business assets and employee resources.

## Features

- **User Authentication**
  - Email/Password and Google Sign-in
  - Role-based authorization (HR and Employee)
  - Protected routes with JWT authentication

- **HR Manager Features**
  - Asset management (add, update, delete)
  - Employee management with package-based limits
  - Request approval system
  - Analytics dashboard with charts
  - Low stock alerts
  - Team management

- **Employee Features**
  - Asset request system
  - Personal asset tracking
  - Team view
  - Monthly request history
  - PDF generation for asset requests

- **Package System**
  - Basic: 5 members for $5/month
  - Standard: 10 members for $8/month
  - Premium: 20 members for $15/month

- **Technical Features**
  - React with Vite
  - Tailwind CSS with DaisyUI
  - Firebase Authentication
  - JWT token management
  - Stripe payment integration
  - Responsive design
  - React Query for data fetching
  - React Hook Form for form handling
  - React Hot Toast for notifications

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Start the development server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Demo Credentials

- **HR Manager**
  - Email: hr@xyz.com
  - Password: hr123456

- **Employee**
  - Email: employee@xyz.com
  - Password: emp123456

## Live Site

[Visit the live site](https://xyz-asset-management.web.app)

## Technologies Used

- React 18
- React Router DOM
- Firebase
- Axios
- TanStack Query
- React Hook Form
- Stripe
- Chart.js
- React Icons
- React Hot Toast
- React Helmet
- DaisyUI
- Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
