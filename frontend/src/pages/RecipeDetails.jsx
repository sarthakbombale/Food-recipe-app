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
import '../styles/RecipeDetails.css'

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
    <div className="bg-light min-vh-100" style={{ paddingTop: '70px' }}>
      <div className="recipe-details-page">
        <Container>
          <Row className="g-4 align-items-start">
            
            {/* IMAGE SECTION */}
            <Col lg={5}>
              <Card className="recipe-image-card shadow border-0 rounded-4 overflow-hidden">
                {recipe.coverImage ? (
                  <Image
                    src={`http://localhost:5000/images/${recipe.coverImage}`}
                    alt={recipe.title}
                    fluid
                    style={{ height: "460px", width: "100%", objectFit: 'cover' }}
                  />
                ) : (
                  <div className="no-image d-flex justify-content-center align-items-center bg-secondary text-white" style={{ height: 460 }}>
                    No Image
                  </div>
                )}
              </Card>
            </Col>

            {/* CONTENT SECTION */}
            <Col lg={7}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-4">
                  
                  {/* AUTHOR */}
                  <div className="recipe-author d-flex align-items-center mb-3">
                    <Image src={profileImg} roundedCircle width={45} height={45} className="me-3" />
                    <div>
                      <div className="fw-bold">{recipe.email}</div>
                      <small className="text-muted">Recipe Author</small>
                    </div>
                  </div>

                  {/* TITLE */}
                  <h2 className="recipe-title fw-bold mb-4">{recipe.title}</h2>

                  {/* INGREDIENTS */}
                  <h6 className="fw-bold mb-2">🥘 Ingredients</h6>
                  <ListGroup variant="flush" className="ingredients-list mb-4">
                    {recipe.ingredients?.map((item, i) => (
                      <ListGroup.Item key={i} className="px-0">
                        <span className="text-danger me-2">✓</span> {item}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {/* INSTRUCTIONS */}
                  <h6 className="fw-bold mb-2">👨‍🍳 Instructions</h6>
                  <p className="recipe-instructions text-secondary" style={{ lineHeight: 1.8 }}>
                    {recipe.instructions}
                  </p>

                  <hr />

                  {/* COMMENTS SECTION */}
                  <h6 className="fw-bold mb-3">💬 Comments ({comments.length})</h6>
                  <div className="comments-container mb-4">
                    {comments.map((c, i) => (
                      <Card key={i} className="comment-card border-0 bg-light mb-2">
                        <Card.Body className="py-2 px-3">
                          <div className="comment-author fw-bold" style={{ fontSize: 14 }}>
                            {c.user?.name || c.user?.email || 'User'}
                          </div>
                          <div className="comment-text" style={{ fontSize: 14 }}>{c.text}</div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>

                  {/* COMMENT INPUT */}
                  <div className="comment-box">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button className="mt-2 post-comment " onClick={postComment}>
                      Post Comment
                    </Button>
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="recipe-footer d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                    <Badge bg="secondary" className="recipe-time">
                      ⏱️ {recipe.time || 'N/A'}
                    </Badge>

                    <div className="d-flex gap-2">
                      <Button className="back-btn" variant="outline-dark" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> Back
                      </Button>

                      <Button 
                        className='like-btn'
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
                              if (window.confirm("Delete this recipe?")) {
                                await axios.delete(
                                  `http://localhost:5000/recipe/${recipe._id}`,
                                  { headers: { authorization: 'bearer ' + token } }
                                )
                                navigate('/')
                              }
                            }}
                          >
                            <MdDelete /> Delete
                          </Button>
                        )}
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}