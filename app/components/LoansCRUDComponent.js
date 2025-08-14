'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Fab,
  IconButton,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Autocomplete,
  Grid,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  AssignmentReturn as ReturnIcon,
  Warning as OverdueIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  Book as BookIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { apiService } from '../services/api';

const LoansCRUDComponent = ({
  title = 'Loans',
  endpoint = '/loans',
  columns = [],
  formFields = [],
  defaultFormValues = {},
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const [availableBooks, setAvailableBooks] = useState([]);
  const [allBorrowers, setAllBorrowers] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [bookSearchLoading, setBookSearchLoading] = useState(false);
  const [borrowerSearchLoading, setBorrowerSearchLoading] = useState(false);
  const [bookInputValue, setBookInputValue] = useState('');
  const [borrowerInputValue, setBorrowerInputValue] = useState('');
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [borrowerSearchTerm, setBorrowerSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAll(endpoint);
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      showSnackbar('Error fetching data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const searchAvailableBooks = async (searchTerm = '') => {
    setBookSearchLoading(true);
    
    try {
      const books = await apiService.getAvailableBooks({ search: searchTerm });
      setAvailableBooks(books || []);
    } catch (error) {
      showSnackbar('Error fetching available books: ' + error.message, 'error');
      setAvailableBooks([]);
    } finally {
      setBookSearchLoading(false);
    }
  };

  const searchBorrowers = async (searchTerm = '') => {
    setBorrowerSearchLoading(true);
    
    try {
      const borrowers = await apiService.getAll('/borrowers', { search: searchTerm });
      setAllBorrowers(borrowers || []);
    } catch (error) {
      showSnackbar('Error fetching borrowers: ' + error.message, 'error');
      setAllBorrowers([]);
    } finally {
      setBorrowerSearchLoading(false);
    }
  };

  // Debounced search effects
  useEffect(() => {
    if (bookSearchTerm.length > 2 || bookSearchTerm === '') {
      const timeoutId = setTimeout(() => {
        searchAvailableBooks(bookSearchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setAvailableBooks([]);
    }
  }, [bookSearchTerm]);

  useEffect(() => {
    if (borrowerSearchTerm.length > 2 || borrowerSearchTerm === '') {
      const timeoutId = setTimeout(() => {
        searchBorrowers(borrowerSearchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setAllBorrowers([]);
    }
  }, [borrowerSearchTerm]);

  useEffect(() => {
    if (dialogOpen) {
      if (!editingItem) {
        // Creating new loan
        setSelectedBook(null);
        setSelectedBorrower(null);
        setBookInputValue('');
        setBorrowerInputValue('');
        setBookSearchTerm('');
        setBorrowerSearchTerm('');
        setAvailableBooks([]);
        setAllBorrowers([]);
      } else {
        // Editing existing loan - load initial data and set selected items
        setBookInputValue('');
        setBorrowerInputValue('');
        setBookSearchTerm('');
        setBorrowerSearchTerm('');
        setAvailableBooks([]);
        setAllBorrowers([]);
        loadExistingLoanData(editingItem);
      }
    }
  }, [dialogOpen, editingItem]);

  const loadExistingLoanData = async (loanData) => {
    try {
      // Load book data if book_id exists
      if (loanData.book_id) {
        try {
          const bookData = await apiService.getById('/books', loanData.book_id);
          if (bookData && bookData.data) {
            setSelectedBook(bookData.data);
          }
        } catch (error) {
          console.error('Error loading book data:', error);
        }
      }
      
      // Load borrower data if borrower_id exists
      if (loanData.borrower_id) {
        try {
          const borrowerData = await apiService.getById('/borrowers', loanData.borrower_id);
          if (borrowerData && borrowerData.data) {
            setSelectedBorrower(borrowerData.data);
          }
        } catch (error) {
          console.error('Error loading borrower data:', error);
        }
      }
    } catch (error) {
      showSnackbar('Error loading loan data: ' + error.message, 'error');
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormValues(defaultFormValues);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormValues(item);
    setDialogOpen(true);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    handleInputChange('book_id', book?.id || '');
  };

  const handleBorrowerSelect = (borrower) => {
    setSelectedBorrower(borrower);
    handleInputChange('borrower_id', borrower?.id || '');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingItem) {
        await apiService.update(endpoint, editingItem.id, formValues);
        showSnackbar('Loan updated successfully', 'success');
      } else {
        await apiService.create(endpoint, formValues);
        showSnackbar('Loan created successfully', 'success');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      showSnackbar('Error saving loan: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this loan?')) {
      return;
    }

    setLoading(true);
    try {
      await apiService.delete(endpoint, id);
      showSnackbar('Loan deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error deleting loan: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    setLoading(true);
    try {
      await apiService.returnBook(loanId);
      showSnackbar('Book returned successfully', 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error returning book: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
    setAnchorEl(null);
  };

  const handleMarkOverdue = async (loanId) => {
    setLoading(true);
    try {
      await apiService.markOverdue(loanId);
      showSnackbar('Loan marked as overdue', 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error marking loan as overdue: ' + error.message, 'error');
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

  const enhancedColumns = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={(event) => handleMenuOpen(event, params.row)}
            color="primary"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <Box>
          <IconButton onClick={fetchData} disabled={loading} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            disabled={loading}
          >
            Add New Loan
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={enhancedColumns}
              loading={loading}
              pageSizeOptions={[5, 10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => selectedLoan && handleReturnBook(selectedLoan.id)}
          disabled={selectedLoan?.status === 'returned'}
        >
          <ReturnIcon sx={{ mr: 1 }} />
          Return Book
        </MenuItem>
        <MenuItem 
          onClick={() => selectedLoan && handleMarkOverdue(selectedLoan.id)}
          disabled={selectedLoan?.status === 'overdue' || selectedLoan?.status === 'returned'}
        >
          <OverdueIcon sx={{ mr: 1 }} />
          Mark Overdue
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Loan' : 'Create New Loan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {editingItem ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BookIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Select Book</Typography>
                    </Box>
                    
                    <Autocomplete
                      options={availableBooks}
                      getOptionLabel={(option) => option ? `${option.name} (${option.isbn})` : ''}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1"><strong>{option.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ISBN: {option.isbn} | Available: {option.available_stock}/{option.stock}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Books"
                          placeholder="Type to search books..."
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {bookSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      value={selectedBook}
                      onChange={(event, newValue) => handleBookSelect(newValue)}
                      inputValue={bookInputValue}
                      onInputChange={(event, newInputValue) => {
                        setBookInputValue(newInputValue);
                        setBookSearchTerm(newInputValue);
                      }}
                      loading={bookSearchLoading}
                      filterOptions={(options) => options}
                      noOptionsText={bookInputValue.length <= 2 ? "Type at least 3 characters to search" : "No books found"}
                    />
                    
                    {selectedBook && (
                      <Box sx={{ mt: 2 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Selected Book
                            </Typography>
                            <Typography variant="body1"><strong>{selectedBook.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ISBN: {selectedBook.isbn}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Available: {selectedBook.available_stock} / {selectedBook.stock}
                            </Typography>
                            {selectedBook.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {selectedBook.description}
                              </Typography>
                            )}
                            <Chip 
                              label={selectedBook.can_be_borrowed ? 'Can be borrowed' : 'Cannot be borrowed'}
                              color={selectedBook.can_be_borrowed ? 'success' : 'error'}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Select Borrower</Typography>
                    </Box>
                    
                    <Autocomplete
                      options={allBorrowers}
                      getOptionLabel={(option) => option ? `${option.name} (${option.id_card_number})` : ''}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1"><strong>{option.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {option.id_card_number} | Email: {option.email}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {option.can_borrow_book && (
                                <Chip label="Can borrow" color="success" size="small" sx={{ mr: 0.5 }} />
                              )}
                              {option.has_active_loan && (
                                <Chip label="Has active loan" color="warning" size="small" sx={{ mr: 0.5 }} />
                              )}
                              {option.has_overdue_loans && (
                                <Chip label="Has overdue" color="error" size="small" />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Borrowers"
                          placeholder="Type to search borrowers..."
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {borrowerSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      value={selectedBorrower}
                      onChange={(event, newValue) => handleBorrowerSelect(newValue)}
                      inputValue={borrowerInputValue}
                      onInputChange={(event, newInputValue) => {
                        setBorrowerInputValue(newInputValue);
                        setBorrowerSearchTerm(newInputValue);
                      }}
                      loading={borrowerSearchLoading}
                      filterOptions={(options) => options}
                      noOptionsText={borrowerInputValue.length <= 2 ? "Type at least 3 characters to search" : "No borrowers found"}
                    />
                    
                    {selectedBorrower && (
                      <Box sx={{ mt: 2 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Selected Borrower
                            </Typography>
                            <Typography variant="body1"><strong>{selectedBorrower.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID Card: {selectedBorrower.id_card_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Email: {selectedBorrower.email}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Chip 
                                label={selectedBorrower.can_borrow_book ? 'Can borrow books' : 'Cannot borrow books'}
                                color={selectedBorrower.can_borrow_book ? 'success' : 'error'}
                                size="small"
                                sx={{ mr: 0.5 }}
                              />
                              {selectedBorrower.has_active_loan && (
                                <Chip label="Has active loan" color="warning" size="small" sx={{ mr: 0.5 }} />
                              )}
                              {selectedBorrower.has_overdue_loans && (
                                <Chip label="Has overdue loans" color="error" size="small" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  {formFields.filter(field => field.name !== 'book_id' && field.name !== 'borrower_id').map((field) => (
                    <TextField
                      key={field.name}
                      fullWidth
                      margin="normal"
                      label={field.label}
                      type={field.type || 'text'}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      multiline={field.multiline}
                      rows={field.rows}
                      helperText={field.helperText}
                      InputLabelProps={field.type === 'datetime-local' ? { shrink: true } : undefined}
                    />
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BookIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Select Book</Typography>
                    </Box>
                    
                    <Autocomplete
                      options={availableBooks}
                      getOptionLabel={(option) => option ? `${option.name} (${option.isbn})` : ''}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1"><strong>{option.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ISBN: {option.isbn} | Available: {option.available_stock}/{option.stock}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Available Books"
                          placeholder="Type to search books..."
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {bookSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      value={selectedBook}
                      onChange={(event, newValue) => handleBookSelect(newValue)}
                      inputValue={bookInputValue}
                      onInputChange={(event, newInputValue) => {
                        setBookInputValue(newInputValue);
                        setBookSearchTerm(newInputValue);
                      }}
                      loading={bookSearchLoading}
                      filterOptions={(options) => options}
                      noOptionsText={bookInputValue.length <= 2 ? "Type at least 3 characters to search" : "No books found"}
                    />
                    
                    {selectedBook && (
                      <Box sx={{ mt: 2 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Selected Book
                            </Typography>
                            <Typography variant="body1"><strong>{selectedBook.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ISBN: {selectedBook.isbn}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Available: {selectedBook.available_stock} / {selectedBook.stock}
                            </Typography>
                            {selectedBook.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {selectedBook.description}
                              </Typography>
                            )}
                            <Chip 
                              label={selectedBook.can_be_borrowed ? 'Can be borrowed' : 'Cannot be borrowed'}
                              color={selectedBook.can_be_borrowed ? 'success' : 'error'}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Select Borrower</Typography>
                    </Box>
                    
                    <Autocomplete
                      options={allBorrowers}
                      getOptionLabel={(option) => option ? `${option.name} (${option.id_card_number})` : ''}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1"><strong>{option.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {option.id_card_number} | Email: {option.email}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {option.can_borrow_book && (
                                <Chip label="Can borrow" color="success" size="small" sx={{ mr: 0.5 }} />
                              )}
                              {option.has_active_loan && (
                                <Chip label="Has active loan" color="warning" size="small" sx={{ mr: 0.5 }} />
                              )}
                              {option.has_overdue_loans && (
                                <Chip label="Has overdue" color="error" size="small" />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Borrowers"
                          placeholder="Type to search borrowers..."
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {borrowerSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      value={selectedBorrower}
                      onChange={(event, newValue) => handleBorrowerSelect(newValue)}
                      inputValue={borrowerInputValue}
                      onInputChange={(event, newInputValue) => {
                        setBorrowerInputValue(newInputValue);
                        setBorrowerSearchTerm(newInputValue);
                      }}
                      loading={borrowerSearchLoading}
                      filterOptions={(options) => options}
                      noOptionsText={borrowerInputValue.length <= 2 ? "Type at least 3 characters to search" : "No borrowers found"}
                    />
                    
                    {selectedBorrower && (
                      <Box sx={{ mt: 2 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              Selected Borrower
                            </Typography>
                            <Typography variant="body1"><strong>{selectedBorrower.name}</strong></Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID Card: {selectedBorrower.id_card_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Email: {selectedBorrower.email}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Chip 
                                label={selectedBorrower.can_borrow_book ? 'Can borrow books' : 'Cannot borrow books'}
                                color={selectedBorrower.can_borrow_book ? 'success' : 'error'}
                                size="small"
                                sx={{ mr: 0.5 }}
                              />
                              {selectedBorrower.has_active_loan && (
                                <Chip label="Has active loan" color="warning" size="small" sx={{ mr: 0.5 }} />
                              )}
                              {selectedBorrower.has_overdue_loans && (
                                <Chip label="Has overdue loans" color="error" size="small" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <TextField
                    fullWidth
                    label="Return Deadline"
                    type="datetime-local"
                    value={formValues.return_deadline || ''}
                    onChange={(e) => handleInputChange('return_deadline', e.target.value)}
                    required
                    helperText="Select return deadline date and time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || (!editingItem && (!selectedBook || !selectedBorrower))}
          >
            {loading ? <CircularProgress size={20} /> : (editingItem ? 'Update' : 'Create Loan')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' },
        }}
        onClick={handleCreate}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default LoansCRUDComponent;
