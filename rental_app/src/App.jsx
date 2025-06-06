
import React from 'react'
import Navbarr from './Components/Navbar/Navbarr'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import {Routes,Route} from "react-router-dom"
import AdminDashboard from './Dashboards/AdminDashboard/AdminDashboard'
import Overview from './Dashboards/AdminDashboard/Overview/Overview'
import AddMaterial from './Dashboards/AdminDashboard/AddMaterial/AddMaterial'
import ViewMaterial from './Dashboards/AdminDashboard/ViewMaterial/ViewMaterial'
import ViewBookings from './Dashboards/AdminDashboard/ViewBookings/ViewBookings'
import Lowstock from './Dashboards/AdminDashboard/Lowstock/Lowstock'
import CustomerDashboard from './Dashboards/CustomerDashboard/CustomerDashboard'
import Adminselection from './Dashboards/CustomerDashboard/AdminSelection/Adminselection'
import ParticularAdmin from './Dashboards/CustomerDashboard/ParticularAdmin/ParticularAdmin'
import Booking from './Dashboards/CustomerDashboard/Booking/Booking'

const App = () => {
  return (
    <div>
      <Navbarr/>
      <Routes>
         
         <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/AdminDashboard"element ={<AdminDashboard/>}>
         <Route path="overview" element={<Overview />} />
          <Route path="add-material" element={<AddMaterial />} />
          <Route path="view-material" element={<ViewMaterial />} />
          <Route path="view-bookings" element={<ViewBookings />} />
          <Route path="low-stock-alert" element={<Lowstock />} />
        </Route>

    
         <Route path="/customerdashboard" element={<CustomerDashboard />}>
        {/* default child route */}
        <Route path="adminselection" element={<Adminselection />} />
<Route path="adminselection/ParticularAdmin/:adminId" element={<ParticularAdmin />} />
<Route path="booking" element={<Booking/>}/>
      </Route>
    
          
          
        
      </Routes>
    </div>
  )
}

export default App
