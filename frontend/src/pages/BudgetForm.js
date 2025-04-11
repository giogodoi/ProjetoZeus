import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import LoadingOverlay from '../components/LoadingOverlay';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../services/api';

const validationSchema = yup.object({
  projectDescription: yup.string().required('Descrição do projeto é obrigatória'),
  clientName: yup.string().required('Nome do cliente é obrigatório'),
  responsibleId: yup.string()/*.required('Responsável é obrigatório')*/,
  estimatedValue: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive('O valor deve ser positivo')
    .required('Valor estimado é obrigatório'),
  expectedCosts: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .positive('O valor deve ser positivo')
    .required('Custos previstos são obrigatórios'),
  status: yup
    .string()
    .oneOf(['under_review', 'approved', 'rejected'], 'Status inválido')
    .required('Status é obrigatório'),
});

const BudgetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
    if (id) {
      fetchBudget();
    }
  }, [id]);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/budgets/${id}`);
      formik.setValues({
        ...response.data,
        estimatedValue: Number(response.data.estimatedValue),
        expectedCosts: Number(response.data.expectedCosts),
      });
    } catch (error) {
      setError('Erro ao carregar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      projectDescription: '',
      clientName: '',
      responsibleId: '',
      estimatedValue: 0,
      expectedCosts: 0,
      status: 'under_review'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        

        // Validar campos obrigatórios
        if (!values.projectDescription || !values.clientName || !values.responsibleId) {
          throw new Error('Todos os campos obrigatórios devem ser preenchidos');
        }

        // Validar valores numéricos
        const estimatedValue = Number(values.estimatedValue);
        const expectedCosts = Number(values.expectedCosts);

        if (isNaN(estimatedValue) || isNaN(expectedCosts)) {
          throw new Error('Os valores numéricos são inválidos');
        }

        if (estimatedValue <= 0 || expectedCosts <= 0) {
          throw new Error('Os valores devem ser maiores que zero');
        }

        const formattedValues = {
          projectDescription: values.projectDescription.trim(),
          clientName: values.clientName.trim(),
          responsibleId: values.responsibleId,
          estimatedValue: estimatedValue,
          expectedCosts: expectedCosts,
          status: values.status
        };
  
        console.log('Dados formatados para envio:', formattedValues);
  
        // Enviar para a API
        let response;
        if (id) {
          response = await api.put(`/budgets/${id}`, formattedValues);
        } else {
          response = await api.post('/budgets', formattedValues);
        }
  
        console.log('Resposta da API:', response.data);
        navigate('/budgets');
      } catch (err) {
        console.error('Erro completo:', err);
        
        let errorMessage = 'Erro ao salvar orçamento';
        
        if (err.response) {
          // Erro da API
          console.error('Detalhes do erro:', err.response.data);
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          // Erro de conexão
          console.error('Erro de conexão:', err.request);
          errorMessage = 'Não foi possível conectar ao servidor';
        } else {
          // Outros erros
          console.error('Erro:', err.message);
          errorMessage = err.message || errorMessage;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      {loading && <LoadingOverlay />}
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Editar Orçamento' : 'Novo Orçamento'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="projectDescription"
                name="projectDescription"
                label="Descrição do Projeto"
                multiline
                rows={3}
                value={formik.values.projectDescription}
                onChange={formik.handleChange}
                error={
                  formik.touched.projectDescription &&
                  Boolean(formik.errors.projectDescription)
                }
                helperText={
                  formik.touched.projectDescription &&
                  formik.errors.projectDescription
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="clientName"
                name="clientName"
                label="Nome do Cliente"
                value={formik.values.clientName}
                onChange={formik.handleChange}
                error={
                  formik.touched.clientName && Boolean(formik.errors.clientName)
                }
                helperText={formik.touched.clientName && formik.errors.clientName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="responsibleId"
                name="responsibleId"
                select
                label="Responsável"
                value={formik.values.responsibleId}
                onChange={formik.handleChange}
                error={
                  formik.touched.responsibleId &&
                  Boolean(formik.errors.responsibleId)
                }
                helperText={
                  formik.touched.responsibleId && formik.errors.responsibleId
                }
              >
                {members.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.fullName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="estimatedValue"
                name="estimatedValue"
                label="Valor Estimado"
                type="number"
                value={formik.values.estimatedValue}
                onChange={formik.handleChange}
                error={
                  formik.touched.estimatedValue &&
                  Boolean(formik.errors.estimatedValue)
                }
                helperText={
                  formik.touched.estimatedValue && formik.errors.estimatedValue
                }
                InputProps={{
                  startAdornment: 'R$',
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="expectedCosts"
                name="expectedCosts"
                label="Custos Previstos"
                type="number"
                value={formik.values.expectedCosts}
                onChange={formik.handleChange}
                error={
                  formik.touched.expectedCosts &&
                  Boolean(formik.errors.expectedCosts)
                }
                helperText={
                  formik.touched.expectedCosts && formik.errors.expectedCosts
                }
                InputProps={{
                  startAdornment: 'R$',
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="status"
                name="status"
                select
                label="Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                <MenuItem value="under_review">Em Análise</MenuItem>
                <MenuItem value="approved">Aprovado</MenuItem>
                <MenuItem value="rejected">Reprovado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja cancelar?')) {
                      navigate('/budgets');
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !formik.isValid}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BudgetForm;
