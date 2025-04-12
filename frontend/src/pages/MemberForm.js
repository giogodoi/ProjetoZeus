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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../services/api';

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Você veio do futuro? 🤔')
    .required('Date of birth is required'),
  email: yup
    .string()
    .email('Insira um email valido')
    .matches(/@compjunior\.com\.br$/, 'Must be a Comp Júnior email')
    .required('Email is required'),
  role: yup.string().required('Role is required'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s-]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  gender: yup.string().required('Gender is required'),
  admissionDate: yup
    .date()
    .max(new Date(), 'A admissão não pode ser futura.')
    .required('Admission date is required'),
  skills: yup.string(),
});

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      dateOfBirth: null,
      email: '',
      role: 'member',
      phoneNumber: '',
      gender: 'prefer_not_to_say',
      admissionDate: null,
      skills: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (id) {
          await api.put(`/members/${id}`, values);
        } else {
          await api.post('/members', values);
        }
        navigate('/members');
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while saving');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchMember = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await api.get(`/members/${id}`);
          const member = response.data;
          formik.setValues({
            ...member,
            dateOfBirth: new Date(member.dateOfBirth),
            admissionDate: new Date(member.admissionDate),
            skills: member.skills.join(', '),
          });
        } catch (err) {
          setError('Error loading member data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMember();
  }, [id]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Member' : 'New Member'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date of Birth"
              value={formik.values.dateOfBirth}
              onChange={(value) => formik.setFieldValue('dateOfBirth', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={
                    formik.touched.dateOfBirth &&
                    Boolean(formik.errors.dateOfBirth)
                  }
                  helperText={
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="role"
              name="role"
              select
              label="Role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="gender"
              name="gender"
              select
              label="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Admission Date"
              value={formik.values.admissionDate}
              onChange={(value) => formik.setFieldValue('admissionDate', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={
                    formik.touched.admissionDate &&
                    Boolean(formik.errors.admissionDate)
                  }
                  helperText={
                    formik.touched.admissionDate && formik.errors.admissionDate
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="skills"
              name="skills"
              label="Skills (comma-separated)"
              value={formik.values.skills}
              onChange={formik.handleChange}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel?')) {
                    navigate('/members');
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formik.isValid}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default MemberForm;
