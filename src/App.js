import "./App.css";
import React, { useEffect, useState, Suspense } from 'react';
import TableComponent from './components/Home/TableComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from "./components/Firebase/Firebase";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Login from './components/Login/Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [emirComp, setEmirComp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmirComp(true);
      } else {
        setUser(null);
        setEmirComp(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      {user ? (
        <div>
          <Container fluid>
            <Row>
              <Col>
                <div className="divWelc">
                  <p >
                    <span> <span className="e-mails">{user.displayName}</span> ismiyle, <span className="e-mails">{user.email}</span> adresini kullanarak giriş yaptınız.</span>
                    <span style={{float : 'right'}}><Button onClick={handleLogout} variant="danger" >Çıkış Yap</Button></span></p>
                </div>
              </Col>
            </Row>
          </Container>
          <div className="DivBos"></div>
          {emirComp ? (
            <div className="App">
              {isLoading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Suspense fallback={<Spinner animation="border" variant="primary" />}>
                  <Container>
                    <Row>
                      <Col></Col>
                      <Col md="auto"><TableComponent userEmail={user.email} /></Col>
                      <Col></Col>
                    </Row>
                  </Container>
                </Suspense>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
