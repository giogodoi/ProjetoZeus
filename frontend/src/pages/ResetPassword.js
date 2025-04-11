import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { resetPassword } from '../services/api';

const validationSchema = yup.object({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  
  // Get token from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await resetPassword(token, values.password);
        navigate('/login', {
          state: { message: 'Password successfully reset. Please login.' },
        });
      } catch (err) {
        setError(
          err.response?.data?.error ||
            'An error occurred while resetting your password'
        );
      }
    },
  });

  if (!token) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Invalid or missing reset token
        </Typography>
        <Link component={RouterLink} to="/forgot-password">
          Request a new password reset
        </Link>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Reset Password
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
          id="password"
          name="password"
          label="New Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          margin="normal"
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            color: 'secondary.main',
            mt: 3, mb: 2 
            }}
          disabled={formik.isSubmitting}
        >
          Recuperar Senha
        </Button>
        <Link component={RouterLink} to="/login" variant="body2">
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPassword;
