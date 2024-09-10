import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [books, setBooks] = useState([
    {
      name: "The Fault In Our Stars",
      author: "John Green",
      img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
      price: 500,
    },
    {
      name: "Weird Science",
      author: "Comic Boom",
      img: "https://m.media-amazon.com/images/I/81x5EbjlZpL._AC_UY218_.jpg",
      price: 700,
    },
    {
      name: "1984",
      author: "George Orwell",
      img: "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
      price: 650,
    },
    {
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      img: "https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg",
      price: 800,
    },
  ]);

  const initPayment = (data, book) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "rzp_test_LCqJqRS9mKaHse",
        amount: data.amount,
        currency: data.currency,
        name: book.name,
        description: "Test Transaction",
        image: book.img,
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyUrl = "http://localhost:8080/api/payment/verify";
            const { data: verifyData } = await axios.post(verifyUrl, response);
            console.log(verifyData);
          } catch (error) {
            console.error("Error during payment verification:", error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay SDK. Please check your internet connection.");
    };
  };

  const handlePayment = async (book) => {
    try {
      const orderUrl = "http://localhost:8080/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: book.price });
      console.log(data);
      initPayment(data.data, book);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">BookStore</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4 flex-grow-1">
        <Row>
          {books.map((book, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={book.img} alt={book.name} style={{ height: '300px', objectFit: 'cover' }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.name}</Card.Title>
                  <Card.Text>
                    By {book.author}
                    <br />
                    Price: ₹{book.price}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handlePayment(book)} 
                    className="mt-auto"
                  >
                    Buy Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <footer className="bg-dark text-light py-4 mt-4">
        <Container>
          <Row>
            <Col md={4}>
              <h5>About Us</h5>
              <p>We are passionate about books and strive to provide the best reading experience for our customers.</p>
            </Col>
            <Col md={4}>
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-light">Terms of Service</a></li>
                <li><a href="#" className="text-light">Privacy Policy</a></li>
                <li><a href="#" className="text-light">FAQ</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>Email: support@bookstore.com<br />Phone: +1 (123) 456-7890</p>
            </Col>
          </Row>
          <Row>
            <Col className="text-center mt-3">
              <p>&copy; 2024 BookStore. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default App;