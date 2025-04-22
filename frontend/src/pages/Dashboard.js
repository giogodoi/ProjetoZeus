import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [adminCount, setAdminCount] = useState(0); // Inicializado como 0
  const [projectData, setProjectData] = useState({
    totalEstimatedValue: 0,
    totalExpectedCosts: 0,
  }); // Inicializado como um objeto vazio com valores padrão
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, projectRes] = await Promise.all([
          api.get('/dashboard/employee-management'),
          api.get('/dashboard/project-management'),
        ]);

        setAdminCount(employeeRes.data.adminCount || 0);
        setProjectData(projectRes.data || { totalEstimatedValue: 0, totalExpectedCosts: 0 });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const chartData = [
    { name: 'Estimated Sales', value: projectData.totalEstimatedValue },
    { name: 'Estimated Costs', value: projectData.totalExpectedCosts },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Seja Bem Vindo, {user.fullName}!
      </Typography>

      <Grid container spacing={3}>
        {/* Ações Rápidas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            {/* Add quick action buttons here */}
          </Paper>
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Atividades Recentes
            </Typography>
            {/* Add recent activity list here */}
          </Paper>
        </Grid>

        {/* Visão do Sistema */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Visão do Sistema" />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Aqui você poderá ver informações gerais sobre o andamento de projetos, número de membros e também o valor financeiro :).
              </Typography>
              <Typography variant="h6" gutterBottom>
                Administradores cadastrados: {adminCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gestão de Projetos */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Gestão de Projetos" />
            <CardContent>
              {chartData.some((data) => data.value > 0) ? (
                <PieChart width={400} height={300}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Typography variant="body1">Nenhum dado disponível para exibir.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;