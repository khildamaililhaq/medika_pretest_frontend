'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navigation from '../../components/Navigation';
import { apiService } from '../../services/api';

export default function AvailableBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  ];

  const fetchAvailableBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getAvailableBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching available books:', error);
      setError('Error fetching available books: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableBooks();
  }, []);

  return (
    <Navigation>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Books
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Books that are currently available for borrowing
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box sx={{ height: 600, width: '100%' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <DataGrid
                  rows={books}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  disableRowSelectionOnClick
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Navigation>
  );
}
