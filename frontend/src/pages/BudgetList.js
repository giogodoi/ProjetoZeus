import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../services/api';

const statusColors = {
  under_review: 'warning',
  approved: 'success',
  rejected: 'error',
};

const statusLabels = {
  under_review: 'Em Análise',
  approved: 'Aprovado',
  rejected: 'Reprovado',
};

const BudgetList = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleEdit = (budgetId) => {
    navigate(`/budgets/${budgetId}`);
  };

  const handleDelete = async () => {
    if (!selectedBudget) return;

    try {
      await api.delete(`/budgets/${selectedBudget.id}`);
      setBudgets(budgets.filter(budget => budget.id !== selectedBudget.id));
      setDeleteDialogOpen(false);
      setSelectedBudget(null);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Orçamentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/budgets/new')}
        >
          Novo Orçamento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Valor Estimado</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.budgetNumber}</TableCell>
                <TableCell>{budget.clientName}</TableCell>
                <TableCell>{budget.responsible?.fullName}</TableCell>
                <TableCell>{formatCurrency(budget.estimatedValue)}</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[budget.status]}
                    color={statusColors[budget.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(budget.creationDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(budget.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setSelectedBudget(budget);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir o orçamento {selectedBudget?.budgetNumber}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetList;
