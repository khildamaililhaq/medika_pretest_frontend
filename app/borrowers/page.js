'use client';
import React from 'react';
import Navigation from '../components/Navigation';
import CRUDComponent from '../components/CRUDComponent';

export default function BorrowersPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'has_active_loan', 
      headerName: 'Has Active Loan', 
      width: 140,
      type: 'boolean',
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? 'orange' : 'green',
            fontWeight: 'bold'
          }}
        >
          {params.value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      field: 'can_borrow_book', 
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
      field: 'has_overdue_loans', 
      headerName: 'Has Overdue', 
      width: 140,
      type: 'boolean',
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? 'red' : 'green',
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
      name: 'id_card_number',
      label: 'ID Card Number',
      type: 'text',
      required: true,
      helperText: 'Enter ID card number (e.g., 1234567890123456)'
    },
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      helperText: 'Enter borrower\'s full name'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      helperText: 'Enter a valid email address'
    },
  ];

  const defaultFormValues = {
    id_card_number: '',
    name: '',
    email: '',
  };

  return (
    <Navigation>
      <CRUDComponent
        title="Borrowers Management"
        endpoint="/borrowers"
        columns={columns}
        formFields={formFields}
        defaultFormValues={defaultFormValues}
      />
    </Navigation>
  );
}
