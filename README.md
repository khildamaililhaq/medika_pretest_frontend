# Library Management System - Next.js with Material UI

A comprehensive Library Management System built with Next.js 15, Material UI, and JavaScript. This application provides complete CRUD operations for managing books, borrowers, and loans with a modern, responsive interface.

## ✨ Features

- **Next.js 15** with App Router
- **Material UI** components and theming
- **Responsive Design** with mobile-first approach
- **Generic CRUD Component** with DataGrid
- **API Service Layer** with Axios
- **Navigation System** with drawer and routing
- **Form Management** with validation
- **Error Handling** and notifications
- **Settings Management** 
- **Docker Support** with multi-stage builds
- **Library-Specific Features**:
  - Books management with ISBN, categories, availability status
  - Borrowers management with membership types and status
  - Loans tracking with due dates, fines, and return management
- **TypeScript Ready** (just rename .js to .tsx)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone or download this boilerplate**
   ```bash
   git clone <your-repo-url>
   cd nextjs-crud-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
Edit `.env.local` and update the API URL to match your backend:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://parkee_pretest_api.localhost
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
library-management-system/
├── app/
│   ├── components/
│   │   ├── CRUDComponent.js    # Generic CRUD component
│   │   └── Navigation.js       # App navigation
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── books/
│   │   └── page.js            # Books CRUD page
│   ├── borrowers/
│   │   └── page.js            # Borrowers CRUD page
│   ├── loans/
│   │   └── page.js            # Loans CRUD page
│   ├── settings/
│   │   └── page.js            # Settings page
│   ├── ThemeProvider.js       # Material UI theme provider
│   ├── theme.js              # Theme configuration
│   ├── layout.js             # Root layout
│   ├── page.js               # Dashboard page
│   └── globals.css           # Global styles
├── public/                   # Static files
├── docker-compose.yml        # Docker production setup
├── docker-compose.dev.yml    # Docker development setup
├── Dockerfile               # Production Docker image
├── Dockerfile.dev           # Development Docker image
├── docker-run.sh            # Docker run script
├── .env.example             # Environment variables template
└── package.json
```

## 🛠️ Usage

### Creating a New CRUD Page

1. Create a new page file (e.g., `app/categories/page.js`):

```jsx
'use client';
import React from 'react';
import Navigation from '../components/Navigation';
import CRUDComponent from '../components/CRUDComponent';

export default function CategoriesPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    // Add more columns as needed
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Category Name',
      type: 'text',
      required: true,
    },
    // Add more form fields as needed
  ];

  return (
    <Navigation>
      <CRUDComponent
        title="Categories"
        endpoint="/categories"
        columns={columns}
        formFields={formFields}
        defaultFormValues={{ name: '' }}
      />
    </Navigation>
  );
}
```

2. Add the new route to the navigation menu in `app/components/Navigation.js`

### API Integration

The application is fully integrated with the Library Management API specification. It supports nested request/response structures and specialized endpoints:

**Books Management:**
- `GET /books` - List all books with pagination
- `POST /books` - Create book (nested: `{book: {...}}`)  
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book
- `GET /books/available` - Get available books
- `GET /books/out_of_stock` - Get out of stock books

**Borrowers Management:**
- `GET /borrowers` - List borrowers with pagination
- `POST /borrowers` - Create borrower (nested: `{borrower: {...}}`)
- `PUT /borrowers/{id}` - Update borrower
- `DELETE /borrowers/{id}` - Delete borrower
- `GET /borrowers/with_active_loans` - Borrowers with active loans
- `GET /borrowers/without_active_loans` - Borrowers without active loans
- `GET /borrowers/{id}/overdue_loans` - Borrower's overdue loans

**Loans Management:**
- `GET /loans` - List loans with pagination
- `POST /loans` - Create loan (nested: `{loan: {...}}`)
- `PUT /loans/{id}` - Update loan
- `DELETE /loans/{id}` - Delete loan
- `PATCH /loans/{id}/return_book` - Return a borrowed book
- `PATCH /loans/{id}/mark_overdue` - Mark loan as overdue
- `GET /loans/active` - Get active loans
- `GET /loans/returned` - Get returned loans
- `GET /loans/overdue` - Get overdue loans
- `GET /loans/due_soon` - Get loans due soon
- `GET /loans/by_borrower/{borrower_id}` - Loans by specific borrower
- `GET /loans/by_book/{book_id}` - Loans by specific book

**Data Models:**

*Book:* `{id, name, description, isbn, stock, available_stock, can_be_borrowed, created_at, updated_at}`

*Borrower:* `{id, id_card_number, name, email, has_active_loan, can_borrow_book, has_overdue_loans, created_at, updated_at}`

*Loan:* `{id, borrower_id, book_id, borrowed_at, return_deadline, returned_at, status, overdue, days_overdue, days_until_due, created_at, updated_at}`

### Customizing the Theme

Edit `app/theme.js` to customize the Material UI theme:

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
    // Add your color customizations
  },
  // Add other theme customizations
});
```

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Your backend API base URL
- `NODE_ENV` - Environment (development/production)

### API Service

The API service (`app/services/api.js`) includes:
- Request/response interceptors
- Authentication token handling
- Error handling
- Generic CRUD operations

## 📱 Pages Included

1. **Dashboard** (`/`) - Overview with library statistics (total books, active borrowers, loans, etc.)
2. **Books** (`/books`) - Complete book management with ISBN, categories, availability tracking
3. **Borrowers** (`/borrowers`) - Member management with membership types and contact information
4. **Loans** (`/loans`) - Loan tracking with due dates, returns, and fine calculations
5. **Settings** (`/settings`) - Application configuration and preferences

## 🎨 UI Components

- **CRUDComponent** - Generic component for data management
- **Navigation** - Responsive sidebar navigation
- **StatCard** - Dashboard statistics display
- **Forms** - Dynamic form generation
- **Data Grid** - Sortable, filterable data table

## 🔐 Authentication (Coming Soon)

The boilerplate is prepared for authentication with:
- Token storage in localStorage
- Request interceptors for auth headers
- Protected routes setup

## 🚢 Deployment

### Docker (Recommended for Production)

#### Quick Start with Docker
```bash
# Make the script executable and run
chmod +x docker-run.sh
./docker-run.sh
```

#### Manual Docker Commands
```bash
# Build the image
docker build -t library-management-system .

# Run the container
docker run -d --name library-system -p 3000:3000 library-management-system
```

#### Docker Compose (Production)
```bash
docker-compose up -d
```

#### Docker Compose (Development with Hot Reload)
```bash
docker-compose -f docker-compose.dev.yml up
```

### Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Next.js documentation
- Check the Material UI documentation

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Documentation](https://react.dev/)
