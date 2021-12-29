import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Icon } from "semantic-ui-react";
import './footer.css'

function Footer() {

    let user = false;
    if(localStorage.hasOwnProperty('token') && localStorage.hasOwnProperty('userData')) {
        user = true
    }

    let stickStyle = {
        marginTop: "auto"
    }

    let styles = {
        "marginLeft": "180px",
        marginTop: "20px"
    }
    return(
        <div>
            {
                user ?
                <footer style={styles}>
                   <Container style={stickStyle}>
                       <hr />
                            <Row>
                                <Col>
                                    <h2>Directions</h2>
                                    <div style={{textAlign: "center"}}>
                                        <h5>Sign In to book movies. You will be redirected to the Seats page where you can then book your seats.</h5>
                                    </div>
                                </Col>
                                <Col>
                                    <h2>About Us</h2>
                                    <div style={{textAlign: "center"}}>
                                        <h5>We are CinFlex, a blockbuster booking solution provider located in Penang</h5>
                                    </div>
                                </Col>
                                <Col>
                                    <h2>Social Media</h2>
                                    <div style={{display: "block"}}>
                                        <div style={{textAlign: "center"}}>
                                            <Icon name="facebook" size='large'/>
                                            <Icon name="instagram" size='large' />
                                            <Icon name="github" size="large" />
                                        </div>
                                    </div>
                                </Col>
                                <small style={{textAlign: "center"}}>Copyright YashDev 2021</small>
                            </Row>
                        </Container>
                </footer>
                :
                    <footer>
                        <Container>
                            <hr />
                            <Row>
                                <Col>
                                    <h2>Directions</h2>
                                    <div style={{textAlign: "center"}}>
                                        <h5>Sign In to book movies. You will be redirected to the Seats page where you can then book your seats.</h5>
                                    </div>
                                </Col>
                                <Col>
                                    <h2>About Us</h2>
                                    <div style={{textAlign: "center"}}>
                                        <h5>We are CinFlex, a blockbuster booking solution provider located in Penang</h5>
                                    </div>
                                </Col>
                                <Col>
                                    <h2>Social Media</h2>
                                    <div style={{display: "block"}}>
                                        <div style={{textAlign: "center"}}>
                                            <Icon name="facebook" size='large'/>
                                            <Icon name="instagram" size='large' />
                                            <Icon name="github" size="large" />
                                        </div>
                                    </div>
                                </Col>
                                <small style={{textAlign: "center"}}>Copyright YashDev 2021</small>
                            </Row>
                        </Container>
                    </footer>
            }
        </div>
    )
}

export default Footer