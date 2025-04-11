import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Seja Bem Vindo, {user.fullName}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            {/* Add quick action buttons here */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Atividades Reentes
            </Typography>
            {/* Add recent activity list here */}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Visão do Sistema" />
            <CardContent>
              <Typography variant="body1">
                Aqui você poderá ver informações gerais sobre o andamento de projetos, numero de membros e também o valor financeiro :).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
