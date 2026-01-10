import React from 'react'
import { Nav, Offcanvas } from 'react-bootstrap'
import { FaBookMedical, FaComment, FaPaypal, FaUserMd, FaUser, FaShieldAlt } from "react-icons/fa";
import { FaMessage } from 'react-icons/fa6';
import { MdDashboard } from 'react-icons/md';
import { NavLink } from 'react-router'
const Sidebar = ({show,setShow}) => {
  const links =  [
    {url:'/admin' ,text:'Dashboard' , icon:<MdDashboard/>},
    {url:'/admin/patient' ,text:'Patients' , icon:<FaUser/>},
    {url:'/admin/view' ,text:'Doctors' , icon:<FaUserMd/>},
    {url:'/admin/viewap' ,text:'Appointments' , icon:<FaBookMedical/>},
    {url:'/admin/review' ,text:'Reviews' , icon:<FaComment/>},
    {url:'/admin/payment' ,text:'Payments' , icon:<FaPaypal/>},
    {url:'/admin/contact-messages' ,text:'Messages' , icon:<FaMessage/>}
  ]
  return (
    <>  <div className="d-none d-md-flex flex-column text-white p-3" 
       style={{ 
         width: "250px",
         background: 'linear-gradient(180deg, #6f42c1, #5a2d91)',
         boxShadow: '4px 0 15px rgba(111, 66, 193, 0.2)',
         minHeight: '100vh'
       }}>
        <div style={{
          textAlign: 'center',
          padding: '20px 0',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: '10px'
          }}>
            <FaShieldAlt style={{ fontSize: '24px' }} />
          </div>
          <h5 className="text-white fw-bold m-0">Admin</h5>
        </div>
        <Nav className="flex-column">
          {links.map((link,index)=>
             <Nav.Link 
               as={NavLink} 
               key={index} 
               to={link.url} 
               className="text-white mb-2"
               style={{
                 padding: '12px 15px',
                 borderRadius: '10px',
                 transition: 'all 0.3s ease',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '12px',
                 fontSize: '15px',
                 fontWeight: '500'
               }}
               onMouseOver={(e) => {
                 e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                 e.target.style.transform = 'translateX(5px)';
               }}
               onMouseOut={(e) => {
                 e.target.style.background = 'transparent';
                 e.target.style.transform = 'translateX(0)';
               }}
             >
             <span style={{ fontSize: '18px' }}>{link.icon}</span> 
             <span>{link.text}</span>
           </Nav.Link>
          )}
         </Nav>
      </div>

      <Offcanvas 
        show={show} 
        onHide={()=>setShow(false)}
        style={{
          background: 'linear-gradient(180deg, #6f42c1, #5a2d91)'
        }}
      >
        <Offcanvas.Header 
          closeButton
          style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}
        >
          <Offcanvas.Title style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaShieldAlt style={{ fontSize: '24px' }} />
            Admin Panel
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
          {links.map((link,index)=>
             <Nav.Link 
               as={NavLink} 
               key={index} 
               to={link.url} 
               className="text-white mb-2"
               style={{
                 padding: '12px 15px',
                 borderRadius: '10px',
                 transition: 'all 0.3s ease',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '12px',
                 fontSize: '15px',
                 fontWeight: '500'
               }}
               onMouseOver={(e) => {
                 e.target.style.background = 'rgba(255, 255, 255, 0.2)';
               }}
               onMouseOut={(e) => {
                 e.target.style.background = 'transparent';
               }}
             >
             <span style={{ fontSize: '18px' }}>{link.icon}</span> 
             <span>{link.text}</span>
           </Nav.Link>
          )} </Nav>
        </Offcanvas.Body>
        </Offcanvas>
    </>
  )
}

export default Sidebar
