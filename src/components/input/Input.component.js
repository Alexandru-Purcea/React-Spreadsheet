import React, { Component } from "react";
import { editCell } from "../../actions/editCell";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  editCell: payload => dispatch(editCell(payload))
});

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      initial: true,
      filter: {
        active: false,
        value1: "",
        value2: ""
      }
    };
  }
  handleChange = event => {
    this.props.editCell({
      column: this.props.id,
      index: this.state.index,
      value: event.target.value
    });
    if (event.target.value !== "" && document.getElementById(this.state.lastId)) {
      document.getElementById(this.state.lastId).style.borderColor = "#e0e0e0";
    }
  };
  handleClick = index => {
    let elementId = this.props.reducer[this.props.id].id + index;
    this.setState({ index: index, lastId: elementId });
  };

  checkInput = event => {
    if (
      event.target.value === "" &&
      this.props.reducer[this.props.id].required
    ) {
      document.getElementById(this.state.lastId).style.borderColor = "red";
    }
  };

  render() {
    let props = this.props;
    let store = props.reducer;
    let index = props.index;
    let value = store[props.id].rows[index];

    const { active, type } = this.props;

    if (active) {
      if (type === "select") {
        return (
          <select
            id={store[props.id].id + index}
            onBlur={this.checkInput}
            value={value}
            onChange={this.handleChange}
            onClick={() => this.handleClick(index)}
          >
            {props.components}
          </select>
        );
      } else {
        return (
          <input
            onBlur={this.checkInput}
            className={store[props.id].id}
            id={store[props.id].id + index}
            type={props.type}
            value={value}
            onChange={this.handleChange}
            onClick={() => this.handleClick(index)}
          />
        );
      }
    }

    return (
      <input
        className={"deactivatedColumn"}
        id={store[props.id].id + index}
        onChange={() => {}}
        type={"text"}
        value={""}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Input);
