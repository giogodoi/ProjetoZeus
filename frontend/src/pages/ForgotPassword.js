import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import { forgotPassword } from '../services/api';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [status, setStatus] = useState({ type: '', message: '' });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await forgotPassword(values.email);
        setStatus({
          type: 'success',
          message: 'Password reset instructions have been sent to your email',
        });
      } catch (err) {
        setStatus({
          type: 'error',
          message:
            err.response?.data?.error || 'An error occurred. Please try again.',
        });
      }
    },
  });

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
        Forgot Password
      </Typography>

      {status.message && (
        <Alert severity={status.type} sx={{ mt: 2, width: '100%' }}>
          {status.message}
        </Alert>
      )}

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={formik.isSubmitting}
        >
          Send Reset Instructions
        </Button>
        <Link component={RouterLink} to="/login" variant="body2">
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
