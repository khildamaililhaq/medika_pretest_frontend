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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiService } from '../services/api';

const CRUDComponent = ({
  title = 'Items',
  endpoint = '/items',
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingItem) {
        await apiService.update(endpoint, editingItem.id, formValues);
        showSnackbar('Item updated successfully', 'success');
      } else {
        await apiService.create(endpoint, formValues);
        showSnackbar('Item created successfully', 'success');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      showSnackbar('Error saving item: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      await apiService.delete(endpoint, id);
      showSnackbar('Item deleted successfully', 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error deleting item: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
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
            Add New
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Create New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {formFields.map((field) => (
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
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingItem ? 'Update' : 'Create')}
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

export default CRUDComponent;
