import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Cost from "./cost";

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.state = { budget: 0, items: [], total: 0 };
  }

  handleSubmit = (event, sumOfTotals) => {
    event.preventDefault();
    const item = [
      { name: event.target.itemName.value, price: event.target.itemCost.value },
    ];

    this.setState({
      budget: event.target.budget.value,
      items: [...this.state.items, ...item],
      total: this.state.total + parseInt(event.target.itemCost.value),
    });
    console.log(this.state);
  };

  render() {
    return (
      <React.Fragment>
        <Card className="bg-light container border-0 ">
          <Card.Header
            className=" bg-light container border-0"
            as="h1"
            style={styles.header}
          >
            BUDGET APP
          </Card.Header>
          <Card.Body>
            <Card.Title style={styles.header}>Calculate Your Budget</Card.Title>

            <Container
              className="rounded-lg"
              style={{ backgroundColor: "lightgrey" }}
            >
              <Form onSubmit={this.handleSubmit} className="p-3">
                <Form.Group
                  onChange={this.handleInputChange}
                  controlId="budget"
                >
                  <Form.Label style={styles.inputs}>Budget</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    value={this.state.value}
                    placeholder="Enter Budget"
                  />
                </Form.Group>

                <Form.Group
                  onChange={this.handleInputChange}
                  controlId="itemName"
                >
                  <Form.Label style={styles.inputs}>Item</Form.Label>
                  <Form.Control
                    type="text"
                    name="itemName"
                    value={this.state.value}
                    placeholder="Input items"
                  />
                </Form.Group>

                <Form.Group controlId="itemCost">
                  <Form.Label style={styles.inputs}>Item Cost</Form.Label>
                  <Form.Control
                    type="number"
                    name="itemCost"
                    value={this.state.value}
                    placeholder="Input items cost"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>

              <Cost
                budget={this.state.budget}
                item={this.state.items}
                total={this.state.total}
              ></Cost>
            </Container>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}
const styles = {
  inputs: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "white",
  },
  header: {
    alignitems: "center",
    textAlign: "center",
    color: "darkgrey",
  },
};
export default FormInput;
