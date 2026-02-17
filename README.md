# Care.xyz - Care Service Booking Platform

Care.xyz is a comprehensive web application designed to connect users with professional care services. Whether it's for elderly care, child care, or specialized medical assistance, Care.xyz provides a seamless platform for finding, booking, and managing care services.

## 🚀 Features

-   **User Authentication**: Secure registration and login using NextAuth.js.
-   **Role-Based Access**: Distinct dashboards and functionalities for Users and Admins.
-   **Service Browsing**: Browse a variety of care services with detailed descriptions and pricing.
-   **Booking System**: Easy-to-use booking interface with date and time selection.
-   **Secure Payments**: Integrated Stripe payment gateway for secure and hassle-free transactions.
-   **Admin Dashboard**:
    -   Manage Services (Add, Edit, Delete).
    -   Manage Users (View, Delete, Toggle Roles).
    -   View Booking Analytics.
-   **User Dashboard**:
    -   View booking history and status.
    -   Cancel pending bookings.
    -   Leave reviews for completed services.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS and Shadcn UI.
-   **Email Notifications**: Automated email invoices and confirmations using Nodemailer.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
-   **Payments**: [Stripe](https://stripe.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Email**: [Nodemailer](https://nodemailer.com/)

## 📂 Project Structure

```bash
care-xyz/
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── (admin)/        # Admin-specific routes
│   │   ├── (auth)/         # Authentication routes (login, register)
│   │   ├── (dashboard)/    # User dashboard routes
│   │   ├── api/            # Backend API endpoints
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── bookings/       # Booking-related components
│   │   ├── ui/             # Shadcn UI primitives
│   │   └── ...
│   ├── lib/                # Utility functions (db connection, email, etc.)
│   ├── models/             # Mongoose database models
│   └── ...
├── public/                 # Static assets
└── ...
```

## ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/care-xyz.git
    cd care-xyz
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Variables:**

    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Database
    MONGO_URI=your_mongodb_connection_string

    # Authentication (NextAuth)
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret_key

    # Stripe Payment
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    STRIPE_SECRET_KEY=your_stripe_secret_key

    # Email (Nodemailer)
    SMTP_EMAIL=your_email_address
    SMTP_PASSWORD=your_email_app_password
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Future Plans

-   **Real-time Chat**: Implement messaging between users and care providers.
-   **Provider Dashboard**: Allow care providers to sign up, manage their profiles, and accept bookings directly.
-   **Advanced Search**: Filter services by location, rating, and price.
-   **Mobile App**: Develop a React Native mobile application for better accessibility.
-   **Calendar Integration**: Sync bookings with Google Calendar or Outlook.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
