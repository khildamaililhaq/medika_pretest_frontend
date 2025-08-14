'use client';
import React from 'react';
import Navigation from '../../components/Navigation';
import LoansCRUDComponent from '../../components/LoansCRUDComponent';

export default function ReturnedLoansPage() {
  const columns = [
    { field: 'id', headerName: 'Loan ID', width: 100 },
    { field: 'borrower_name', headerName: 'Borrower Name', width: 120 },
    { field: 'book_name', headerName: 'Book Name', width: 100 },
    { 
      field: 'borrowed_at', 
      headerName: 'Borrowed At', 
      width: 150,
      type: 'dateTime',
      valueGetter: (params) => {
        return params ? new Date(params) : null;
      }
    },
    { 
      field: 'return_deadline', 
      headerName: 'Return Deadline', 
      width: 150,
      type: 'dateTime',
      valueGetter: (params) => {
        return params ? new Date(params) : null;
      }
    },
    { 
      field: 'returned_at', 
      headerName: 'Returned At', 
      width: 150,
      type: 'dateTime',
      valueGetter: (params) => {
        return params ? new Date(params) : null;
      },
      renderCell: (params) => {
        if (!params.value) return '-';
        return (
          <span
            style={{
              color: '#4caf50',
              fontWeight: 'bold'
            }}
          >
            {new Date(params.value).toLocaleDateString()}
          </span>
        );
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => {
        return (
          <span
            style={{
              color: '#4caf50',
              fontWeight: 'bold',
              backgroundColor: '#e8f5e8',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            {params.value}
          </span>
        );
      }
    },
    { 
      field: 'overdue', 
      headerName: 'Was Overdue', 
      width: 120,
      type: 'boolean',
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? '#ff9800' : '#4caf50',
            fontWeight: 'bold'
          }}
        >
          {params.value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      field: 'days_overdue', 
      headerName: 'Days Overdue', 
      width: 120,
      type: 'number',
      renderCell: (params) => {
        if (!params.value || params.value === 0) return '-';
        return (
          <span
            style={{
              color: '#ff9800',
              fontWeight: 'bold',
              backgroundColor: '#fff3e0',
              padding: '2px 6px',
              borderRadius: '12px'
            }}
          >
            {params.value}
          </span>
        );
      }
    },
    { 
      field: 'days_until_due', 
      headerName: 'Days Until Due', 
      width: 130,
      type: 'number'
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
      name: 'borrower_id',
      label: 'Borrower ID',
      type: 'number',
      required: true,
      helperText: 'Enter the borrower ID'
    },
    {
      name: 'book_id',
      label: 'Book ID',
      type: 'number',
      required: true,
      helperText: 'Enter the book ID to loan'
    },
    {
      name: 'return_deadline',
      label: 'Return Deadline',
      type: 'datetime-local',
      required: true,
      helperText: 'Select return deadline date and time'
    },
  ];

  const defaultFormValues = {
    borrower_id: '',
    book_id: '',
    return_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  };

  return (
    <Navigation>
      <LoansCRUDComponent
        title="Returned Loans"
        endpoint="/loans/returned"
        columns={columns}
        formFields={formFields}
        defaultFormValues={defaultFormValues}
      />
    </Navigation>
  );
}
