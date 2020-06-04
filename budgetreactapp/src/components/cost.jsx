import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const Cost = (props) => {
  const budget = props.budget;
  const total = props.total;
  const remaining = budget - total;

  const items = props.item.map((item, index) => (
    <li style={styles.list} key={index}>
      {item.name}: {item.price}
    </li>
  ));

  function isOverBudget(remainingBudget) {
    if (remainingBudget < 0) {
      return true;
    }
    return false;
  }

  let overBudget = isOverBudget(remaining);

  return (
    <div>
      <Container style={styles.containers}>
        <Card style={styles.containers}>
          <Card.Body>
            <ul style={styles.ul}>
              <span> Budget: {budget} </span> <br />
              <span style={overBudget ? styles.red : styles.black}>
                Remaining Budget: {remaining}
              </span>
              <br />
              <span> Total Cost: {total} </span> <br />
              <span> Item & Cost:{items}</span>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

const styles = {
  red: { color: "red" },
  black: { color: "black" },
  containers: {
    backgroundColor: "lightgrey",
    alignitems: "center",
    textAlign: "left",
    fontWeight: "bold",
    color: "black",
    border: "none",
  },
  list: {
    textTransform: "capitalize",
    fontStyle: "italic",
    textDecoration: "underline",
    fontSize: "18px",
    fontWeight: "normal",
  },
  ul: { listStyle: "none", fontSize: "20px" },
};

export default Cost;
