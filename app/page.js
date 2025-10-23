'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  ShoppingCart as ProductIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as StatsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import Navigation from './components/Navigation';
import { apiService } from './services/api';
import Link from 'next/link';

const StatCard = ({ title, value, icon, color, description, action }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" color={color}>
            {value}
          </Typography>
          {description && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          )}
          {action && (
            <Box sx={{ mt: 2 }}>
              {action}
            </Box>
          )}
        </Box>
        <Box sx={{ color: color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const QuickActions = () => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Quick Actions
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component={Link}
        href="/products/new"
        sx={{ minWidth: 150 }}
      >
        Add Product
      </Button>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        component={Link}
        href="/categories/new"
        sx={{ minWidth: 150 }}
      >
        Add Category
      </Button>
    </Box>
  </Paper>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    publishedProducts: 0,
    unpublishedProducts: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError('');

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        apiService.getProducts({ per_page: 10 }),
        apiService.getCategories({ per_page: 100 })
      ]);

      const products = productsResponse.data || [];
      const categories = categoriesResponse.data || [];

      const publishedProducts = products.filter(p => p.publish).length;
      const unpublishedProducts = products.filter(p => !p.publish).length;

      setStats({
        totalProducts: productsResponse.meta?.total_data || products.length,
        totalCategories: categoriesResponse.meta?.total_data || categories.length,
        publishedProducts,
        unpublishedProducts,
      });

      // Get recent products (assuming API returns them sorted by creation date)
      setRecentProducts(products.slice(0, 5));

    } catch (err) {
      setError('Error fetching overview data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <Navigation>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Navigation>
    );
  }

  if (error) {
    return (
      <Navigation>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Navigation>
    );
  }

  const mainStats = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <ProductIcon fontSize="inherit" />,
      color: 'primary.main',
      description: 'All products in system',
      action: (
        <Button
          size="small"
          component={Link}
          href="/products"
          sx={{ mt: 1 }}
        >
          View All
        </Button>
      )
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories.toLocaleString(),
      icon: <CategoryIcon fontSize="inherit" />,
      color: 'secondary.main',
      description: 'Product categories',
      action: (
        <Button
          size="small"
          component={Link}
          href="/categories"
          sx={{ mt: 1 }}
        >
          View All
        </Button>
      )
    },
    {
      title: 'Published Products',
      value: stats.publishedProducts.toLocaleString(),
      icon: <TrendingUpIcon fontSize="inherit" />,
      color: 'success.main',
      description: 'Active products'
    },
    {
      title: 'Unpublished Products',
      value: stats.unpublishedProducts.toLocaleString(),
      icon: <StatsIcon fontSize="inherit" />,
      color: 'warning.main',
      description: 'Draft products'
    },
  ];

  const recentProductsItems = recentProducts.map(product => ({
    label: product.name,
    description: `Category: ${product.category?.name || 'N/A'} • ${product.publish ? 'Published' : 'Unpublished'}`,
    value: new Date(product.created_at).toLocaleDateString(),
    color: product.publish ? 'success' : 'default',
    icon: <ProductIcon color={product.publish ? 'success' : 'action'} />
  }));

  return (
    <Navigation>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Product management system overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mainStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <QuickActions />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Products
              </Typography>
              {recentProductsItems.length > 0 ? (
                <List dense>
                  {recentProductsItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{item.description}</span>
                              <Chip
                                label={item.value}
                                size="small"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentProductsItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No products found. <Link href="/products/new">Create your first product</Link>
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">API Status</Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Last Sync</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date().toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Version</Typography>
                  <Typography variant="body2" color="textSecondary">v1.0.0</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Navigation>
  );
}
