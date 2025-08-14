'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Refresh as RefreshIcon,
  AssignmentReturn as ReturnIcon,
  Warning as OverdueIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import Navigation from '../../components/Navigation';
import { apiService } from '../../services/api';

export default function ActiveLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

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
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => {
        let color = 'black';
        if (params.value === 'active') color = 'blue';
        else if (params.value === 'overdue') color = 'red';
        
        return (
          <span
            style={{
              color: color,
              fontWeight: 'bold'
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
      field: 'days_until_due', 
      headerName: 'Days Until Due', 
      width: 130,
      type: 'number'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, params.row)}
          color="primary"
        >
          <MoreIcon />
        </IconButton>
      ),
    },
  ];

  const fetchActiveLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getActiveLoans();
      setLoans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching active loans:', error);
      setError('Error fetching active loans: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    setLoading(true);
    try {
      await apiService.returnBook(loanId);
      alert('Book returned successfully');
      fetchActiveLoans();
    } catch (error) {
      setError('Error returning book: ' + error.message);
    } finally {
      setLoading(false);
    }
    setAnchorEl(null);
  };

  const handleMarkOverdue = async (loanId) => {
    setLoading(true);
    try {
      await apiService.markOverdue(loanId);
      alert('Loan marked as overdue');
      fetchActiveLoans();
    } catch (error) {
      setError('Error marking loan as overdue: ' + error.message);
    } finally {
      setLoading(false);
    }
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, loan) => {
    setAnchorEl(event.currentTarget);
    setSelectedLoan(loan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLoan(null);
  };

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  return (
    <Navigation>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Active Loans
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Currently active book loans
            </Typography>
          </div>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchActiveLoans}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

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
                  rows={loans}
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

        {}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem 
            onClick={() => selectedLoan && handleReturnBook(selectedLoan.id)}
          >
            <ReturnIcon sx={{ mr: 1 }} />
            Return Book
          </MenuItem>
          <MenuItem 
            onClick={() => selectedLoan && handleMarkOverdue(selectedLoan.id)}
            disabled={selectedLoan?.status === 'overdue'}
          >
            <OverdueIcon sx={{ mr: 1 }} />
            Mark Overdue
          </MenuItem>
        </Menu>
      </Box>
    </Navigation>
  );
}
