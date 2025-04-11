const express = require('express');
const { User } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all members
router.get('/', auth, async (req, res) => {
  try {
    const members = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'dateOfBirth', 'role', 'admissionDate', 'skills', 'phoneNumber', 'gender'],
      order: [['fullName', 'ASC']]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching members' });
  }
});

// Get member by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await User.findByPk(req.params.id, {
      attributes: ['id', 'fullName', 'email', 'dateOfBirth', 'role', 'admissionDate', 'skills']
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching member' });
  }
});

// Create new member
router.post('/', auth, async (req, res) => {
  try {
    const { fullName, email, dateOfBirth, role, admissionDate, skills, phoneNumber, gender } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user with a default password
    const newMember = await User.create({
      fullName,
      email,
      dateOfBirth,
      role,
      admissionDate,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      password: 'CompJunior2023!', // Default password
      isActive: true,
      phoneNumber: phoneNumber || '', // Fornecer um valor padrão vazio se não fornecido
      gender: gender || 'Não informado' // Fornecer um valor padrão se não fornecido
    });

    res.status(201).json({
      id: newMember.id,
      fullName: newMember.fullName,
      email: newMember.email,
      dateOfBirth: newMember.dateOfBirth,
      role: newMember.role,
      admissionDate: newMember.admissionDate,
      skills: newMember.skills
    });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Error creating member' });
  }
});

// Update member
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await User.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const { fullName, email, dateOfBirth, role, admissionDate, skills, phoneNumber, gender } = req.body;
    
    // Check if email is being changed and if it's already in use
    if (email !== member.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    await member.update({
      fullName,
      email,
      dateOfBirth,
      role,
      admissionDate,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      phoneNumber,
      gender
    });

    res.json({
      id: member.id,
      fullName: member.fullName,
      email: member.email,
      dateOfBirth: member.dateOfBirth,
      role: member.role,
      admissionDate: member.admissionDate,
      skills: member.skills,
      phoneNumber: member.phoneNumber,
      gender: member.gender
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Error updating member' });
  }
});

module.exports = router;
