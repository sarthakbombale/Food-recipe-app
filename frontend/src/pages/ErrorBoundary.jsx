import React from 'react'
import { Container, Alert, Button } from 'react-bootstrap'
import { useRouteError, useNavigate } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()
  
  console.error('Route Error:', error)

  return (
    <Container className="py-5">
      <div className="text-center">
        <Alert variant="danger">
          <h4>Oops! Something went wrong</h4>
          <p>{error?.message || 'An unexpected error occurred'}</p>
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
          className="mt-3"
        >
          Back to Home
        </Button>
      </div>
    </Container>
  )
}
