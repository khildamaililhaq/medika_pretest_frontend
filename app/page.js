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
  LinearProgress,
} from '@mui/material';
import {
  Error as OverdueIcon,
  Schedule as DueSoonIcon,
  AssignmentReturn as ReturnedIcon,
  AssignmentTurnedIn as AssignmentReturn,
  Warning as ActiveIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as StatsIcon,
  Person as PersonIcon,
  MenuBook as BookIcon,
} from '@mui/icons-material';
import Navigation from './components/Navigation';
import { apiService } from './services/api';

const StatCard = ({ title, value, icon, color, description }) => (
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
        </Box>
        <Box sx={{ color: color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const QuickStatsList = ({ title, items, icon }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <List dense>
      {items.map((item, index) => (
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
                    color={item.color || 'default'}
                    size="small"
                  />
                </Box>
              }
            />
          </ListItem>
          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  </Paper>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    dueSoonLoans: 0,
    returnedLoans: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [
        allLoans,
        activeLoans,
        overdueLoans,
        dueSoonLoans,
        returnedLoans,
      ] = await Promise.all([
        apiService.getAll('/loans'),
        apiService.getActiveLoans(),
        apiService.getOverdueLoans(),
        apiService.getLoansDueSoon(),
        apiService.getReturnedLoans({ per_page: 10 }),
      ]);

      setStats({
        totalLoans: allLoans.length,
        activeLoans: activeLoans.length,
        overdueLoans: overdueLoans.length,
        dueSoonLoans: dueSoonLoans.length,
        returnedLoans: returnedLoans.length,
      });

      const activityItems = [];
      
      overdueLoans.slice(0, 5).forEach(loan => {
        activityItems.push({
          type: 'overdue',
          loanId: loan.id,
          borrowerId: loan.borrower_id,
          bookId: loan.book_id,
          daysOverdue: loan.days_overdue,
          timestamp: loan.return_deadline,
        });
      });
      
      returnedLoans.slice(0, 5).forEach(loan => {
        activityItems.push({
          type: 'returned',
          loanId: loan.id,
          borrowerId: loan.borrower_id,
          bookId: loan.book_id,
          returnedAt: loan.returned_at,
          timestamp: loan.returned_at,
        });
      });
      
      activityItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivity(activityItems.slice(0, 8));

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

  const overallProgress = stats.totalLoans > 0 ? (stats.returnedLoans / stats.totalLoans) * 100 : 0;
  const criticalIssues = stats.overdueLoans;
  const urgentIssues = stats.dueSoonLoans;

  const mainStats = [
    {
      title: 'Total Loans',
      value: stats.totalLoans.toLocaleString(),
      icon: <StatsIcon fontSize="inherit" />,
      color: 'primary.main',
      description: 'All loans in system'
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans.toLocaleString(),
      icon: <ActiveIcon fontSize="inherit" />,
      color: 'info.main',
      description: 'Currently borrowed books'
    },
    {
      title: 'Overdue Loans',
      value: stats.overdueLoans.toLocaleString(),
      icon: <OverdueIcon fontSize="inherit" />,
      color: 'error.main',
      description: 'Require immediate attention'
    },
    {
      title: 'Due Soon',
      value: stats.dueSoonLoans.toLocaleString(),
      icon: <DueSoonIcon fontSize="inherit" />,
      color: 'warning.main',
      description: 'Due within next few days'
    },
  ];

  const systemHealthItems = [
    {
      label: 'System Health',
      description: criticalIssues > 0 ? 'Critical issues detected' : 'All systems operational',
      value: criticalIssues > 0 ? 'Critical' : 'Good',
      color: criticalIssues > 0 ? 'error' : 'success',
      icon: <TrendingUpIcon color={criticalIssues > 0 ? 'error' : 'success'} />
    },
    {
      label: 'Return Rate',
      description: `${overallProgress.toFixed(1)}% of loans completed`,
      value: `${overallProgress.toFixed(1)}%`,
      color: overallProgress > 80 ? 'success' : overallProgress > 60 ? 'warning' : 'error',
      icon: <AssignmentReturn color={overallProgress > 80 ? 'success' : overallProgress > 60 ? 'warning' : 'error'} />
    },
    {
      label: 'Urgent Actions',
      description: `${urgentIssues} loans due soon`,
      value: urgentIssues,
      color: urgentIssues > 10 ? 'error' : urgentIssues > 5 ? 'warning' : 'success',
      icon: <DueSoonIcon color={urgentIssues > 10 ? 'error' : urgentIssues > 5 ? 'warning' : 'success'} />
    },
  ];

  const activityItems = recentActivity.map(activity => ({
    label: activity.type === 'overdue' 
      ? `Loan #${activity.loanId} is overdue`
      : `Loan #${activity.loanId} returned`,
    description: activity.type === 'overdue'
      ? `${activity.daysOverdue} days overdue - Borrower ${activity.borrowerId}`
      : `Book ${activity.bookId} returned by Borrower ${activity.borrowerId}`,
    value: activity.type === 'overdue' ? `${activity.daysOverdue}d` : '✓',
    color: activity.type === 'overdue' ? 'error' : 'success',
    icon: activity.type === 'overdue' 
      ? <OverdueIcon color="error" />
      : <ReturnedIcon color="success" />
  }));

  return (
    <Navigation>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Comprehensive library management overview
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
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Return Completion Rate
                  </Typography>
                  <Typography variant="body2">
                    {overallProgress.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={overallProgress} 
                  color={overallProgress > 80 ? 'success' : overallProgress > 60 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {stats.returnedLoans} out of {stats.totalLoans} total loans have been returned
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <QuickStatsList
              title="System Health"
              items={systemHealthItems}
              icon={<StatsIcon color="primary" />}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <QuickStatsList
              title="Recent Activity"
              items={activityItems.slice(0, 6)}
              icon={<TrendingUpIcon color="primary" />}
            />
          </Grid>
        </Grid>

        {(criticalIssues > 0 || urgentIssues > 5) && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Critical Attention Required
                </Typography>
                <Typography>
                  {criticalIssues > 0 && `${criticalIssues} overdue loans require immediate attention. `}
                  {urgentIssues > 5 && `${urgentIssues} loans are due soon and may become overdue.`}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        )}
      </Box>
    </Navigation>
  );
}
