'use client';
import React from 'react';
import Navigation from '../../components/Navigation';
import LoansCRUDComponent from '../../components/LoansCRUDComponent';

export default function DueSoonLoansPage() {
  const columns = [
    { field: 'id', headerName: 'Loan ID', width: 100 },
    { field: 'borrower_id', headerName: 'Borrower ID', width: 120 },
    { field: 'book_id', headerName: 'Book ID', width: 100 },
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
        let color = 'black';
        let backgroundColor = '#f5f5f5';
        if (params.value === 'active') {
          color = '#ff9800';
          backgroundColor = '#fff3e0';
        }
        else if (params.value === 'returned') color = 'green';
        else if (params.value === 'overdue') color = 'red';
        
        return (
          <span
            style={{
              color: color,
              fontWeight: 'bold',
              backgroundColor: backgroundColor,
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
            color: params.value ? 'red' : 'green',
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
      type: 'number'
    },
    { 
      field: 'days_until_due', 
      headerName: 'Days Until Due', 
      width: 130,
      type: 'number',
      renderCell: (params) => {
        let color = 'black';
        let backgroundColor = '#f5f5f5';
        
        if (params.value <= 3) {
          color = '#d32f2f';
          backgroundColor = '#ffebee';
        } else if (params.value <= 7) {
          color = '#ff9800';
          backgroundColor = '#fff3e0';
        }
        
        return (
          <span
            style={{
              color: color,
              fontWeight: 'bold',
              backgroundColor: backgroundColor,
              padding: '2px 6px',
              borderRadius: '12px'
            }}
          >
            {params.value || 0}
          </span>
        );
      }
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
        title="Loans Due Soon"
        endpoint="/loans/due_soon"
        columns={columns}
        formFields={formFields}
        defaultFormValues={defaultFormValues}
      />
    </Navigation>
  );
}
