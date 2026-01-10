import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Card, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrash, FaUserInjured, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaPills, FaPrint, FaFileAlt } from "react-icons/fa";
import { MdMedicalServices, MdDescription } from 'react-icons/md';

const Prescription = () => {
  const { id } = useParams(); // appointmentId from URL
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prescription data
        const prescRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/medicalReports?appointmentId=${id}`);
        if (prescRes.data.length === 0) {
          alert("Prescription not found!");
          return;
        }
        const prescriptionData = prescRes.data[0];
        setPrescription(prescriptionData);

        // Fetch patient data
        const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${prescriptionData.patientId}`);
        setPatient(patientRes.data);

        // Fetch appointment details
        const appointmentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`);
        setAppointment(appointmentRes.data);
      } catch (err) {
        console.error("Error fetching prescription details:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteMedicine = async (index) => {
    try {
      const updatedMedicines = prescription.medicines.filter((_, i) => i !== index);
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/medicalReports/${prescription.id}`, { medicines: updatedMedicines });
      setPrescription((prev) => ({ ...prev, medicines: updatedMedicines }));
      toast.success("Medicine deleted successfully!");
    } catch (err) {
      console.error("Error deleting medicine:", err);
      toast.error("Failed to delete medicine.");
    }
  };

  const handlePrint = () => {
    let olddata = document.body.innerHTML
    document.body.innerHTML = document.getElementById('data').innerHTML
    window.print();
    document.body.innerHTML = olddata
  };

  if (!prescription || !patient || !appointment) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
          marginBottom: '20px',
          animation: 'pulse 2s infinite'
        }}>
          <MdMedicalServices style={{ fontSize: '40px', color: 'white' }} />
        </div>
        <h4 style={{ color: '#0d6efd' }}>Loading prescription...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 p-2" id="data">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <Card style={{
        border: 'none',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: '15px'
          }}>
            <MdMedicalServices style={{ fontSize: '35px' }} />
          </div>
          <h3 style={{ margin: '0', fontWeight: '700', fontSize: '28px' }}>Medical Prescription</h3>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '15px' }}>Complete Patient Treatment Record</p>
        </div>

        <div style={{ padding: '30px' }}>
          {/* Print Button */}
          <div className="no-print" style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Button 
              onClick={handlePrint}
              style={{
                background: 'linear-gradient(135deg, #198754, #20c997)',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '10px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(25, 135, 84, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaPrint style={{ fontSize: '16px' }} />
              Print Report
            </Button>
          </div>

          {/* Patient Details */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FaUserInjured style={{ color: '#0d6efd', fontSize: '22px' }} />
              <h5 style={{ margin: 0, fontWeight: '700', color: '#2c3e50' }}>Patient Information</h5>
            </div>
            <Table borderless style={{ marginBottom: 0, fontSize: '15px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', width: '30%', fontWeight: '600', color: '#495057' }}>
                    <FaUserInjured style={{ marginRight: '8px', color: '#0d6efd' }} />
                    Name:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{patient.username}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', fontWeight: '600', color: '#495057' }}>
                    <FaEnvelope style={{ marginRight: '8px', color: '#0d6efd' }} />
                    Email:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{patient.email}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', fontWeight: '600', color: '#495057' }}>
                    <FaPhone style={{ marginRight: '8px', color: '#0d6efd' }} />
                    Phone:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{patient.phone}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Appointment Details */}
          <div style={{
            background: 'linear-gradient(135deg, #fff3cd, #ffe69c)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FaCalendarAlt style={{ color: '#fd7e14', fontSize: '22px' }} />
              <h5 style={{ margin: 0, fontWeight: '700', color: '#2c3e50' }}>Appointment Information</h5>
            </div>
            <Table borderless style={{ marginBottom: 0, fontSize: '15px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', width: '30%', fontWeight: '600', color: '#495057' }}>
                    <FaCalendarAlt style={{ marginRight: '8px', color: '#fd7e14' }} />
                    Date:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{appointment.date}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', fontWeight: '600', color: '#495057' }}>
                    <FaClock style={{ marginRight: '8px', color: '#fd7e14' }} />
                    Time Slot:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{appointment.slot}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Prescription Details */}
          <div style={{
            background: 'linear-gradient(135deg, #e7f3ff, #cfe7ff)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FaPills style={{ color: '#dc3545', fontSize: '22px' }} />
              <h5 style={{ margin: 0, fontWeight: '700', color: '#2c3e50' }}>Prescribed Medicines</h5>
            </div>
            <Table hover style={{ marginBottom: 0, fontSize: '14px', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
              <thead style={{ background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '12px', fontWeight: '600', border: 'none' }}>Medicine Name</th>
                  <th style={{ padding: '12px', fontWeight: '600', border: 'none' }}>Dosage</th>
                  <th style={{ padding: '12px', fontWeight: '600', border: 'none' }}>Meal Timing</th>
                  <th className="no-print" style={{ padding: '12px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((med, index) => (
                  <tr key={index} style={{ transition: 'all 0.3s ease' }}>
                    <td style={{ padding: '12px', color: '#2c3e50', fontWeight: '600' }}>
                      <FaPills style={{ marginRight: '8px', color: '#dc3545', fontSize: '14px' }} />
                      {med.name}
                    </td>
                    <td style={{ padding: '12px', color: '#495057' }}>{med.dosage}</td>
                    <td style={{ padding: '12px', color: '#495057' }}>{med.mealTiming}</td>
                    <td className="no-print" style={{ padding: '12px', textAlign: 'center' }}>
                      <Button 
                        size="sm" 
                        onClick={() => handleDeleteMedicine(index)}
                        style={{
                          background: 'linear-gradient(135deg, #dc3545, #c82333)',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Additional Information */}
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            padding: '20px',
            borderRadius: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FaFileAlt style={{ color: '#198754', fontSize: '22px' }} />
              <h5 style={{ margin: 0, fontWeight: '700', color: '#2c3e50' }}>Additional Information</h5>
            </div>
            <Table borderless style={{ marginBottom: 0, fontSize: '15px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', width: '30%', fontWeight: '600', color: '#495057', verticalAlign: 'top' }}>
                    <MdDescription style={{ marginRight: '8px', color: '#198754' }} />
                    Description:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{prescription.description}</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', fontWeight: '600', color: '#495057' }}>
                    <FaCalendarAlt style={{ marginRight: '8px', color: '#198754' }} />
                    Next Appointment:
                  </td>
                  <td style={{ padding: '10px', color: '#2c3e50' }}>{prescription.nextAppointmentDate || "Not Scheduled"}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Prescription;
