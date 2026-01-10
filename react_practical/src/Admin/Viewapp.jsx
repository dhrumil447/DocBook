import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaCalendarAlt, FaSearch, FaFilePdf, FaUserMd, FaUser, FaTimes } from 'react-icons/fa';
import { MdEventNote } from 'react-icons/md';

const AdminViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments`);
        
        const appointmentsWithDetails = await Promise.all(
          res.data.map(async (appt) => {
            try {
              const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${appt.patientId}`);
              const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${appt.doctorId}`);
              const paymentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/Payment?appointmentId=${appt.id}`);

              // Check if payment data exists
              const paymentData = paymentRes.data.length > 0 ? paymentRes.data[0] : { razorpayId: "N/A", paymentMethod: "N/A" };

              return {
                ...appt,
                patientName: patientRes.data.username,
                patientPhone: patientRes.data.phone,
                patientEmail: patientRes.data.email,
                doctorName: doctorRes.data.username,
                formattedDate: formatDate(appt.date),
                razorpayId: paymentData.razorpayId,
                paymentMethod: paymentData.paymentMethod,
              };
            } catch (err) {
              console.error("Error fetching details:", err);
              return { 
                ...appt, 
                patientName: "Unknown", 
                doctorName: "Unknown", 
                patientPhone: "-", 
                patientEmail: "-", 
                formattedDate: formatDate(appt.date),
                razorpayId: "N/A",
                paymentMethod: "N/A",
              };
            }
          })
        );

        setAppointments(appointmentsWithDetails);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  // Cancel appointment
  const cancelAppointment = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, { status: "Canceled" });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "Canceled" } : appt))
      );
      toast.success("Appointment canceled successfully!");
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error("Failed to cancel appointment.");
    }
  };

  // Filter Appointments based on search query & date
  const filteredAppointments = appointments.filter((appt) => {
    return (
      (appt.id.toString().includes(searchQuery) || 
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (searchDate ? appt.date === formatDate(searchDate) : true)
    );
  });

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Doctor Appointments Report", 14, 10);

    const tableColumn = ["App.ID", "Patient", "Doctor", "Date", "Time Slot", "Payment Method", "Payment ID", "Status"];
    const tableRows = [];

    filteredAppointments.forEach(appt => {
      const rowData = [
        appt.id,
        appt.patientName,
        `Dr. ${appt.doctorName}`,
        appt.formattedDate,
        appt.slot,
        appt.paymentMethod,
        appt.razorpayId,
        appt.status || "Pending"
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });

    doc.save("Appointments_Report.pdf");
  };

  return (
    <div className="container mt-4">
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
            <FaCalendarAlt style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Appointment Management</h3>
        </div>
      </div>

      <Card className="p-4" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px' }}>
        <div className="d-flex gap-2 mb-3">
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', zIndex: 1 }} />
            <Form.Control
              type="text"
              placeholder="Search by ID, Doctor Name, or Patient Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '10px', border: '2px solid #e9ecef' }}
            />
          </div>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{ borderRadius: '10px', border: '2px solid #e9ecef', maxWidth: '200px' }}
          />
          <Button
            onClick={generatePDF}
            style={{
              background: 'linear-gradient(135deg, #198754, #20c997)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
          >
            <FaFilePdf /> Download PDF
          </Button>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)', color: 'white' }}>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>App.ID</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Patient</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Doctor</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Email</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Phone</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Date</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Time Slot</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Payment</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '600', color: '#6f42c1' }}>#{appt.id}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0dcaf0, #0d6efd)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FaUser style={{ fontSize: '14px' }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{appt.patientName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FaUserMd style={{ fontSize: '14px' }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>Dr. {appt.doctorName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057', fontSize: '14px' }}>{appt.patientEmail}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057', fontSize: '14px' }}>{appt.patientPhone}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057', fontWeight: '500' }}>{appt.date}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>{appt.slot}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', fontSize: '13px' }}>
                      <div style={{ fontWeight: '600', color: '#2c3e50' }}>{appt.paymentMethod}</div>
                      <small style={{ color: '#6c757d' }}>{appt.razorpayId}</small>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: appt.status === "Canceled" ? 'linear-gradient(135deg, #dc3545, #c82333)' : 'linear-gradient(135deg, #198754, #20c997)',
                        color: 'white',
                        display: 'inline-block'
                      }}>
                        {appt.status || "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                      {appt.status === "Canceled" ? (
                        <Button
                          disabled
                          style={{
                            background: '#6c757d',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}
                        >
                          Canceled
                        </Button>
                      ) : (
                        <Button
                          onClick={() => cancelAppointment(appt.id)}
                          style={{
                            background: 'linear-gradient(135deg, #dc3545, #c82333)',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <FaTimes /> Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <MdEventNote style={{ fontSize: '50px', marginBottom: '15px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '16px' }}>No appointments found.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminViewAppointments;
