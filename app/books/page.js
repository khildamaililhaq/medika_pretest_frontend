'use client';
import React from 'react';
import Navigation from '../components/Navigation';
import CRUDComponent from '../components/CRUDComponent';

export default function BooksPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Book Name', width: 250 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'isbn', headerName: 'ISBN', width: 150 },
    { 
      field: 'stock', 
      headerName: 'Total Stock', 
      width: 120,
      type: 'number'
    },
    { 
      field: 'available_stock', 
      headerName: 'Available', 
      width: 120,
      type: 'number'
    },
    { 
      field: 'can_be_borrowed', 
      headerName: 'Can Borrow', 
      width: 120,
      type: 'boolean',
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? 'green' : 'red',
            fontWeight: 'bold'
          }}
        >
          {params.value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      field: 'created_at', 
      headerName: 'Created', 
      width: 150,
      type: 'dateTime',
      valueGetter: (params) => {
        return params ? new Date(params) : null;
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Updated', 
      width: 150,
      type: 'dateTime',
      valueGetter: (params) => {
        return params ? new Date(params) : null;
      }
    },
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Book Name',
      type: 'text',
      required: true,
      helperText: 'Enter the book name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: false,
      multiline: true,
      rows: 3,
      helperText: 'Book description (optional)'
    },
    {
      name: 'isbn',
      label: 'ISBN',
      type: 'text',
      required: true,
      helperText: 'Enter the ISBN number'
    },
    {
      name: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      required: true,
      helperText: 'Enter total stock quantity'
    },
  ];

  const defaultFormValues = {
    name: '',
    description: '',
    isbn: '',
    stock: 1,
  };

  return (
    <Navigation>
      <CRUDComponent
        title="Books Management"
        endpoint="/books"
        columns={columns}
        formFields={formFields}
        defaultFormValues={defaultFormValues}
      />
    </Navigation>
  );
}
