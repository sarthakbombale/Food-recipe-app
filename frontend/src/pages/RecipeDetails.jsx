import React, { useState } from 'react'
import profileImg from '../assets/profile.png'
import { useLoaderData, useNavigate } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  ListGroup,
  Badge,
  Form,
  Button
} from 'react-bootstrap'
import { FaArrowLeft, FaHeart } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import axios from 'axios'
<<<<<<< HEAD
=======
import '../styles/RecipeDetails.css'
>>>>>>> d81b541 (Updated recipe app)

export default function RecipeDetails() {
  const recipe = useLoaderData()
  const navigate = useNavigate()

  const [comments, setComments] = useState(recipe.comments || [])
  const [commentText, setCommentText] = useState('')
  const [likes, setLikes] = useState(recipe.likes?.length || 0)

  const postComment = async () => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Login required')
    if (!commentText.trim()) return

    const res = await axios.post(
      `http://localhost:5000/recipe/${recipe._id}/comment`,
      { text: commentText },
      { headers: { authorization: 'bearer ' + token } }
    )

    setComments(res.data)
    setCommentText('')
  }

  return (
<<<<<<< HEAD
    <div className="bg-light min-vh-100" style={{ paddingTop: '70px' }}>
=======
    <div className="recipe-details-page">
>>>>>>> d81b541 (Updated recipe app)
      <Container>
        <Row className="g-4 align-items-start">

          {/* IMAGE */}
          <Col lg={5}>
<<<<<<< HEAD
            <Card className="shadow border-0 rounded-4 overflow-hidden">
=======
            <Card className="recipe-image-card shadow border-0 rounded-4 overflow-hidden">
>>>>>>> d81b541 (Updated recipe app)
              {recipe.coverImage ? (
                <Image
                  src={`http://localhost:5000/images/${recipe.coverImage}`}
                  alt={recipe.title}
                  fluid
<<<<<<< HEAD
                  style={{ height: "460px", objectFit: 'cover' }}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center bg-secondary text-white" style={{ height: 320 }}>
                  No Image
                </div>
=======
                />
              ) : (
                <div className="no-image">No Image</div>
>>>>>>> d81b541 (Updated recipe app)
              )}
            </Card>
          </Col>

          {/* CONTENT */}
          <Col lg={7}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body className="p-4">

                {/* AUTHOR */}
<<<<<<< HEAD
                <div className="d-flex align-items-center mb-3">
                  <Image src={profileImg} roundedCircle width={45} height={45} className="me-3" />
=======
                <div className="recipe-author mb-3">
                  <Image src={profileImg} roundedCircle />
>>>>>>> d81b541 (Updated recipe app)
                  <div>
                    <div className="fw-bold">{recipe.email}</div>
                    <small className="text-muted">Recipe Author</small>
                  </div>
                </div>

                {/* TITLE */}
<<<<<<< HEAD
                <h2 className="fw-bold mb-4">{recipe.title}</h2>

                {/* INGREDIENTS */}
                <h6 className="fw-bold mb-2">🥘 Ingredients</h6>
                <ListGroup variant="flush" className="mb-4">
                  {recipe.ingredients?.map((item, i) => (
                    <ListGroup.Item key={i} className="px-0">
                      <span className="text-danger me-2">✓</span>
                      {item}
=======
                <h2 className="recipe-title">{recipe.title}</h2>

                {/* INGREDIENTS */}
                <h6 className="fw-bold mb-2">🥘 Ingredients</h6>
                <ListGroup variant="flush" className="ingredients-list mb-4">
                  {recipe.ingredients?.map((item, i) => (
                    <ListGroup.Item key={i}>
                      <span>✓</span> {item}
>>>>>>> d81b541 (Updated recipe app)
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {/* INSTRUCTIONS */}
                <h6 className="fw-bold mb-2">👨‍🍳 Instructions</h6>
<<<<<<< HEAD
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
=======
                <p className="recipe-instructions">
>>>>>>> d81b541 (Updated recipe app)
                  {recipe.instructions}
                </p>

                {/* COMMENTS */}
                <hr />
<<<<<<< HEAD
                <h6 className="fw-bold mb-3">💬 Comments ({comments.length})</h6>

                {comments.map((c, i) => (
                  <Card key={i} className="border-0 bg-light mb-2">
                    <Card.Body className="py-2 px-3">
                      <div className="fw-bold" style={{ fontSize: 14 }}>
                        {c.user?.name || c.user?.email || 'User'}
                      </div>
                      <div style={{ fontSize: 14 }}>{c.text}</div>
=======
                <h6 className="fw-bold mb-3">
                  💬 Comments ({comments.length})
                </h6>

                {comments.map((c, i) => (
                  <Card key={i} className="comment-card mb-2">
                    <Card.Body className="py-2 px-3">
                      <div className="comment-author">
                        {c.user?.name || c.user?.email || 'User'}
                      </div>
                      <div className="comment-text">{c.text}</div>
>>>>>>> d81b541 (Updated recipe app)
                    </Card.Body>
                  </Card>
                ))}

<<<<<<< HEAD
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write your comment..."
                  className="mt-3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <Button className="mt-2" onClick={postComment}>
                  Post Comment
                </Button>

                {/* FOOTER */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">

                  <Badge bg="secondary">
=======
                <div className="comment-box">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button className="mt-2" onClick={postComment}>
                    Post Comment
                  </Button>
                </div>

                {/* FOOTER */}
                <div className="recipe-footer mt-4 pt-3 border-top">
                  <Badge bg="secondary" className="recipe-time">
>>>>>>> d81b541 (Updated recipe app)
                    ⏱️ {recipe.time || 'N/A'}
                  </Badge>

                  <div className="d-flex gap-2">
<<<<<<< HEAD

                    <Button variant="outline-dark" onClick={() => navigate(-1)}>
                      <FaArrowLeft /> Back
                    </Button>

                    <Button
=======
                    <Button className="back-btn" variant="outline-dark" onClick={() => navigate(-1)}>
                      <FaArrowLeft /> Back
                    </Button>

                    <Button  className='like-btn active'
>>>>>>> d81b541 (Updated recipe app)
                      variant="outline-danger"
                      onClick={async () => {
                        const token = localStorage.getItem('token')
                        if (!token) return alert('Login required')
                        const res = await axios.post(
                          `http://localhost:5000/recipe/${recipe._id}/like`,
                          {},
                          { headers: { authorization: 'bearer ' + token } }
                        )
                        setLikes(res.data.likes)
                      }}
                    >
                      <FaHeart /> {likes}
                    </Button>

                    {localStorage.getItem('user') &&
                      JSON.parse(localStorage.getItem('user'))._id === recipe.createdBy && (
                        <Button
                          variant="outline-secondary"
                          onClick={async () => {
                            const token = localStorage.getItem('token')
                            await axios.delete(
                              `http://localhost:5000/recipe/${recipe._id}`,
                              { headers: { authorization: 'bearer ' + token } }
                            )
                            navigate('/')
                          }}
                        >
                          <MdDelete /> Delete
                        </Button>
                      )}
<<<<<<< HEAD

=======
>>>>>>> d81b541 (Updated recipe app)
                  </div>
                </div>

              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  )
}
