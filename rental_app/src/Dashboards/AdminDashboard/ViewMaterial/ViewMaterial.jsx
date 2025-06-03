import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../ConfigFirebase/config'
import './ViewMaterial.css'

const ViewMaterial = () => {
  const [viewMaterial, setViewMaterial] = useState([])
  const [loading, setLoading] = useState(true)
  const loggedinUserFirebase = JSON.parse(localStorage.getItem("loggedInAdmin"))
  console.log(loggedinUserFirebase, "admin who loggedin")

  useEffect(() => {
    const fetchingDataMaterials = async () => {
      const adminDocRef = doc(db, "Admins", loggedinUserFirebase.user.displayName)
      const getDocRef = await getDoc(adminDocRef) //getting snapshotquery
      console.log(getDocRef, "getDocRef")

      if (getDocRef.exists()) {
        const data = getDocRef.data()
        console.log(data, "dataof sanpshot") //get who looged the doc
        setViewMaterial(data.materials || [])
        setLoading(false)
      } else {
        setViewMaterial([])
        setLoading(false)
        console.log("No data found for this admin.")
      }
    }
    fetchingDataMaterials()
  }, [])

  if (loading) {
    return <p>loading.........wait a moment</p>
  }
  return (
    <div>
      <h1>Materials Available</h1>
      <div className="container">
        {viewMaterial.map((material, index) => (
          <div className="card" key={index}>
            <img src={material.imageurl} alt={material.name} />
            <div className="card-content">
              <h5 className="card-title">{material.name}</h5>
              <p className="card-description"> description:{material.description}</p>
              <div className="card-info">
                <span>Size: {material.size}</span>
                <span>Price: ${material.price}</span>
                <span>Category: {material.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewMaterial 
