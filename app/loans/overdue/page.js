'use client';
import React from 'react';
import Navigation from '../../components/Navigation';
import LoansCRUDComponent from '../../components/LoansCRUDComponent';

export default function OverdueLoansPage() {
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
              color: 'red',
              fontWeight: 'bold',
              backgroundColor: '#ffebee',
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
      headerName: 'Overdue', 
      width: 100,
      type: 'boolean',
      renderCell: (params) => (
        <span
          style={{
            color: 'red',
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
      renderCell: (params) => (
        <span
          style={{
            color: 'red',
            fontWeight: 'bold',
            backgroundColor: '#ffcdd2',
            padding: '2px 6px',
            borderRadius: '12px'
          }}
        >
          {params.value || 0}
        </span>
      )
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
        title="Overdue Loans"
        endpoint="/loans/overdue"
        columns={columns}
        formFields={formFields}
        defaultFormValues={defaultFormValues}
      />
    </Navigation>
  );
}
