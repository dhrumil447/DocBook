import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaMoneyBillWave, FaUserMd, FaFilePdf, FaSearch, FaUsers } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [doctorPayments, setDoctorPayments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorPatients, setDoctorPatients] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentRes = await axios.get("http://localhost:1000/Payment");
        const paymentsWithDetails = await Promise.all(
          paymentRes.data.map(async (payment) => {
            let doctorName = "Unknown";
            let patientName = "Unknown";

            try {
              const doctorRes = await axios.get(`http://localhost:1000/doctors/${payment.doctorId}`);
              doctorName = doctorRes.data.username;
            } catch (error) {
              console.error("Error fetching doctor details:", error);
            }

            try {
              const patientRes = await axios.get(`http://localhost:1000/patients/${payment.patientId}`);
              patientName = patientRes.data.username;
            } catch (error) {
              console.error("Error fetching patient details:", error);
            }

            return { ...payment, doctorName, patientName };
          })
        );

        setPayments(paymentsWithDetails);
        calculateDoctorPayments(paymentsWithDetails);
      } catch (err) {
        console.error("Error fetching payments:", err);
        toast.error("Error fetching payments");
      }
    };

    fetchPayments();
  }, []);

  const calculateDoctorPayments = (payments) => {
    const groupedPayments = payments.reduce((acc, pay) => {
      if (!acc[pay.doctorName]) {
        acc[pay.doctorName] = {
          doctorId: pay.doctorId,
          doctorName: pay.doctorName,
          totalAppointments: 0,
          totalPayment: 0,
          cashPayment: 0,
          onlinePayment: 0,
        };
      }

      acc[pay.doctorName].totalAppointments += 1;
      acc[pay.doctorName].totalPayment += pay.amount;

      if (pay.paymentMethod === "Pay on Counter") {
        acc[pay.doctorName].cashPayment += pay.amount;
      } else {
        acc[pay.doctorName].onlinePayment += pay.amount;
      }

      return acc;
    }, {});

    setDoctorPayments(Object.values(groupedPayments));
  };

  const handleDoctorClick = (doctorId, doctorName) => {
    setSelectedDoctor(doctorName);

    const filteredPatients = payments
      .filter((pay) => pay.doctorId === doctorId)
      .reduce((acc, pay) => {
        if (!acc[pay.patientName]) {
          acc[pay.patientName] = {
            patientName: pay.patientName,
            totalAppointments: 0,
            totalPayment: 0,
            cashPayment: 0,
            onlinePayment: 0,
          };
        }

        acc[pay.patientName].totalAppointments += 1;
        acc[pay.patientName].totalPayment += pay.amount;

        if (pay.paymentMethod === "Pay on Counter") {
          acc[pay.patientName].cashPayment += pay.amount;
        } else {
          acc[pay.patientName].onlinePayment += pay.amount;
        }

        return acc;
      }, {});

    setDoctorPatients(Object.values(filteredPatients));
  };

  const downloadDoctorPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Doctor-wise Payment Report", 14, 15);

    const tableColumn = ["Doctor ID", "Doctor Name", "Total Appointments", "Total Payment", "Cash Payment", "Online Payment"];
    const tableRows = doctorPayments.map((doc) => [
      doc.doctorId,
      doc.doctorName,
      doc.totalAppointments,
      `${doc.totalPayment}`,
      `${doc.cashPayment}`,
      `${doc.onlinePayment}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: "bold",
      },
    });

    doc.save("Doctor-Payment-Report.pdf");
  };

  const downloadPatientPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${selectedDoctor} - Patient Payment Report`, 14, 15);

    const tableColumn = ["Patient Name", "Total Appointments", "Total Payment", "Cash Payment", "Online Payment"];
    const tableRows = doctorPatients.map((pat) => [
      pat.patientName,
      pat.totalAppointments,
      `${pat.totalPayment}`,
      `${pat.cashPayment}`,
      `${pat.onlinePayment}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: {
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: "bold",
      },
    });

    doc.save(`${selectedDoctor}_Patient_Report.pdf`);
  };

  const filteredDoctors = doctorPayments.filter((doc) =>
    doc.doctorName.toLowerCase().includes(search.toLowerCase()) || doc.doctorId.toString().includes(search)
  );

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
            <FaMoneyBillWave style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Payment Management</h3>
        </div>
      </div>

      <Card className="p-4" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h5 style={{ margin: 0, fontWeight: '700', color: '#2c3e50' }}>Doctor-wise Payment Summary</h5>
          <Button
            onClick={downloadDoctorPDF}
            style={{
              background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <FaFilePdf /> Download PDF
          </Button>
        </div>

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', zIndex: 1 }} />
          <Form.Control
            type="text"
            placeholder="Search by Doctor Name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px', borderRadius: '10px', border: '2px solid #e9ecef' }}
          />
        </div>

        <div className="table-responsive">
          <Table className="mb-0">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)', color: 'white' }}>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Doctor ID</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Doctor Name</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Total Appointments</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'right' }}>Total Payment</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'right' }}>Cash Payment</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'right' }}>Online Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr
                  key={doc.doctorId}
                  onClick={() => handleDoctorClick(doc.doctorId, doc.doctorName)}
                  style={{
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '600', color: '#6f42c1' }}>#{doc.doctorId}</td>
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
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>{doc.doctorName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center', fontWeight: '600', color: '#495057' }}>{doc.totalAppointments}</td>
                  <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'right', fontWeight: '700', color: '#198754' }}>₹{doc.totalPayment}</td>
                  <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'right', color: '#0dcaf0', fontWeight: '600' }}>₹{doc.cashPayment}</td>
                  <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'right', color: '#6f42c1', fontWeight: '600' }}>₹{doc.onlinePayment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {selectedDoctor && (
          <Button
            onClick={downloadPatientPDF}
            style={{
              background: 'linear-gradient(135deg, #198754, #20c997)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <FaFilePdf /> Download Patient PDF
          </Button>
        )}
      </Card>
    </div>
  );
};

export default AdminPayments;
