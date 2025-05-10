import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  Paper,
  Avatar,
} from '@mui/material';

import { LockOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório.'),
  password: yup
    .string()
    .required('Senha é obrigatória.'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { token, user } = await login(values.email, values.password);
        authLogin(token, user);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred during login');
      }
    },
  });

  return (
    <>
      {/* Imagem de fundo em tela cheia */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/images/traineescomp.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1
      }} />

      <Box
        sx={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            zIndex: 2
          }}
        >
          <img
            src="/images/comp-junior-logo-black.svg"
            alt="CompJúnior Logo"
            style={{ height: 60 }}
          />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {/* Adicione texto aqui, se desejar */}
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            position: 'relative',
            zIndex: 2,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '400px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(11, 42, 69, 0.37)',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" color="secondary.main" fontWeight="bold">
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="E-mail"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  }
                }
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                fontSize: '1.1rem'
              }}
              disabled={formik.isSubmitting}
            >
              Entrar
            </Button>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              sx={{
                color: 'secondary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Esqueceu sua senha?
            </Link>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
