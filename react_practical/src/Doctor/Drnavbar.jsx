import React from 'react'
import { Button, Navbar } from 'react-bootstrap'
import { FaBars, FaUserMd, FaSignOutAlt } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const Drnavbar = ({setShow}) => {
const redirect =  useNavigate()
const handleLogout = ()=>{
    if(sessionStorage.getItem("DocBook") != null){
      sessionStorage.removeItem("DocBook")
      toast.success("loggedout successfully")
      redirect('/') } }

let {username:drname} = JSON.parse(sessionStorage.getItem("DocBook"))
 
  return (
      <Navbar style={{
        background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
        boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)'
      }} className="px-3 d-flex justify-content-between">
    <div className="d-flex align-items-center">
      <button 
        className="btn d-md-none" 
        onClick={()=>setShow(true)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px'
        }}
      >
        <FaBars style={{ fontSize: '20px' }} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)'
        }}>
          <MdDashboard style={{ fontSize: '22px', color: 'white' }} />
        </div>
        <Navbar.Brand className="fw-bold" style={{ color: 'white', margin: 0, fontSize: '20px' }}>
          Doctor Panel
        </Navbar.Brand>
      </div>
    </div>
    <div className="d-flex align-items-center gap-3">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '8px 15px',
        borderRadius: '25px',
        backdropFilter: 'blur(10px)'
      }}>
        <FaUserMd style={{ color: 'white', fontSize: '18px' }} />
        <span style={{ color: 'white', fontWeight: '600' }}>Dr. {drname}</span>
      </div>
      <Button 
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          color: 'white',
          fontWeight: '600',
          padding: '8px 20px',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}
        onClick={handleLogout}
        onMouseOver={(e) => {
          e.target.style.background = 'white';
          e.target.style.color = '#0d6efd';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.25)';
          e.target.style.color = 'white';
        }}
      >
        <FaSignOutAlt style={{ fontSize: '16px' }} />
        Logout
      </Button>
  </div>
  </Navbar>
  )
}

export default Drnavbar
