import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-light text-text-main flex items-center justify-center">
        <h1 className="text-3xl font-bold bg-primary text-white p-4 rounded-radius-lg shadow-shadow-md">
          ColocApp Client Initialized
        </h1>
      </div>
    </BrowserRouter>
  )
}

export default App
