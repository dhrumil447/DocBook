import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { selectpatients, store_patients } from '../redux/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { FaPenAlt, FaTrash, FaUser, FaUsers } from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ViewPatient = () => {
  
  const patients = useSelector(selectpatients);
  const dispatch = useDispatch();
  const redirect = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?isAdmin=false`);
      const patientList = Array.isArray(res.data.patients) ? res.data.patients : res.data;
      dispatch(store_patients(patientList));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async(id)=>{
    if(window.confirm("are you sure to delete this??")){
      try{
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/patients/${id}`)
        toast.success("patient deleted successfully")
        setIsDeleted(!isDeleted)
      }
      catch(err){toast.error(err)}
  }
}
  return (
    <>
       <div className='mt-3'>
            <div style={{
              background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px',
              boxShadow: '0 4px 15px rgba(111, 66, 193, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <FaUsers style={{ fontSize: '28px', color: 'white' }} />
                </div>
                <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Patient Management</h3>
              </div>
            </div>
            <Card style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px', overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)', color: 'white' }}>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Sr. No</th>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Patient Name</th>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Age</th>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Gender</th>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Phone</th>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Email</th>
                      <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                          <FaUsers style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.5 }} />
                          <p style={{ margin: 0 }}>No Patients Found</p>
                        </td>
                      </tr>
                    ) : patients.map((patient, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '600' }}>{index + 1}</td>
                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}>
                              <FaUser style={{ fontSize: '18px' }} />
                            </div>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{patient.username}</span>
                          </div>
                        </td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>{patient.age}</td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>{patient.gender}</td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>{patient.phone}</td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>{patient.email}</td>
                        <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <button
                            className='btn btn-sm me-2'
                            onClick={() => redirect(`/admin/patient/edit/${patient.id}`)}
                            style={{
                              background: 'linear-gradient(135deg, #198754, #20c997)',
                              border: 'none',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            <FaPenAlt />
                          </button>
                          <button
                            className='btn btn-sm'
                            onClick={() => handleDelete(patient.id)}
                            style={{
                              background: 'linear-gradient(135deg, #dc3545, #c82333)',
                              border: 'none',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            <FaTrash/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
    </>
  )
}

export default ViewPatient
