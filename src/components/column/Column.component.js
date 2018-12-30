import React, { Component } from "react";
import { connect } from "react-redux";
import "./Column.css";
import { editCell } from "../../actions/editCell";
import InputComponent from "../input/Input.component";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  editCell: payload => dispatch(editCell(payload))
});

class Column extends Component {
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
    if (event.target.type === "checkbox") {
      this.setState({
        filter: {
          ...this.state.filter,
          active: event.target.checked
        }
      });
    } else {
      this.props.editCell({
        column: this.props.id,
        index: this.state.index,
        value: event.target.value
      });
      if (event.target.value !== "") {
        document.getElementById(this.state.lastId).style.borderColor =
          "#e0e0e0";
      }
    }
  };
  handleFilterChange = event => {
    const target = event.target;
    if (target.type === "text" || target.type === "select-one") {
      this.setState({
        initial: false,
        filter: { ...this.state.filter, value1: event.target.value }
      });
    } else if (target.type === "number") {
      if (target.id === "filterNumberInput1") {
        this.setState({
          filter: { ...this.state.filter, value1: event.target.value }
        });
      } else {
        this.setState({
          filter: { ...this.state.filter, value2: event.target.value }
        });
      }
    } else if (target.type === "date") {
      if (target.id === "filterDateInput1") {
        this.setState({
          filter: { ...this.state.filter, value1: event.target.value }
        });
      } else {
        this.setState({
          filter: { ...this.state.filter, value2: event.target.value }
        });
      }
    }
  };

  handleClick = index => {
    let elementId = this.props.reducer[this.props.id].id + index;
    this.setState({ index: index, lastId: elementId });
  };
  filter = (index, components) => {
    let props = this.props;
    let store = props.reducer;
    let value = store[props.id].rows[index];
    let value1 = this.state.filter.value1;
    let value2 = this.state.filter.value2;
    if (props.type !== "select" && this.state.filter.active) {
      if (props.type === "text") {
        if (value.search(value1) !== -1) {
          return (
            <InputComponent
              index={index}
              id={props.id}
              active={true}
              type={props.type}
            />
          );
        } else
          return (
            <InputComponent
              index={index}
              id={props.id}
              active={false}
              type={props.type}
            />
          );
      } else if (props.type === "number") {
        if (value1 === "") {
          value1 = -Number.MAX_VALUE;
        }
        if (value2 === "") {
          value2 = Number.MAX_VALUE;
        }
        if (
          (value2 - value1 >= 0 && value - value1 > 0 && value - value2 < 0) ||
          (value1 - value2 >= 0 && value - value2 > 0 && value - value1 < 0)
        ) {
          return (
            <InputComponent
              index={index}
              id={props.id}
              active={true}
              type={props.type}
            />
          );
        } else
          return (
            <InputComponent
              index={index}
              id={props.id}
              active={false}
              type={props.type}
            />
          );
      } else if (props.type === "date") {
        value = new Date(value);
        value1 = new Date(value1);
        value2 = new Date(value2);
        if (
          (isNaN(value1.getTime()) && isNaN(value2.getTime())) ||
          (isNaN(value1.getTime()) && value < value2) ||
          (isNaN(value2.getTime()) && value > value1) ||
          (value2 > value1 && value > value1 && value < value2) ||
          (value2 < value1 && value < value1 && value > value2)
        ) {
          return (
            <InputComponent
              index={index}
              id={props.id}
              active={true}
              type={props.type}
            />
          );
        } else {
          return (
            <InputComponent
              index={index}
              id={props.id}
              active={false}
              type={props.type}
            />
          );
        }
      }
    } else if (props.type === "select") {
      if (this.state.initial) {
        value1 = props.options[0];
      }
      if (
        (this.state.filter.active && value === value1) ||
        !this.state.filter.active
      ) {
        return (
          <InputComponent
            index={index}
            id={props.id}
            active={true}
            type={props.type}
            components={components}
          />
        );
      } else
        return (
          <InputComponent
            index={index}
            id={props.id}
            active={false}
            type={props.type}
          />
        );
    } else {
      return (
        <InputComponent
          index={index}
          id={props.id}
          active={true}
          type={props.type}
        />
      );
    }
  };

  render() {
    let props = this.props;
    let store = props.reducer;
    let RowComponents = [];
    let FilterOptions = [];
    for (let i = 0; i < store[props.id].rows.length; i++) {
      if (props.type !== "select") {
        RowComponents.push(this.filter(i, []));
      } else {
        let OptionComponents = [];
        FilterOptions = [];
        for (let i = 0; i < props.options.length; i++) {
          FilterOptions.push(
            <option
              key={props.options[i] + i + "filter"}
              value={props.options[i]}
            >
              {props.options[i]}
            </option>
          );
          OptionComponents.push(
            <option key={props.options[i] + i} value={props.options[i]}>
              {props.options[i]}
            </option>
          );
        }
        RowComponents.push(this.filter(i, OptionComponents));
      }
    }
    let column = store[props.id];
    return (
      <div className="columnContainer">
        <input
          className={store[props.id].id}
          id={store[props.id].id + "title"}
          type={"text"}
          onClick={() => this.handleClick("title")}
          value={store[props.id].title}
          onChange={this.handleChange}
        />
        {RowComponents}
        {column.id !== "IndexColumn" && (
          <div>
            <label>
              Filter:
              <input
                name="Filter"
                type="checkbox"
                checked={this.state.filter.active}
                onChange={this.handleChange}
                id="filterCheckbox"
              />
            </label>

            {column.id !== "IndexColumn" && (
              <form onSubmit={this.handleSelectSubmit}>
                {column.type === "text" && (
                  <input
                    type="text"
                    value={this.state.filter.value1}
                    onChange={this.handleFilterChange}
                    id={"filterTextInput"}
                  />
                )}
                {column.type === "number" && (
                  <div>
                    <input
                      type="number"
                      value={this.state.filter.value1}
                      onChange={this.handleFilterChange}
                      id={"filterNumberInput1"}
                      className="filterNumber"
                    />
                    <input
                      type="number"
                      value={this.state.filter.value2}
                      onChange={this.handleFilterChange}
                      id={"filterNumberInput2"}
                      className="filterNumber"
                    />
                  </div>
                )}
                {column.type === "date" && (
                  <div className="dateFilterContainer">
                    <input
                      type="date"
                      value={this.state.filter.value1}
                      onChange={this.handleFilterChange}
                      id={"filterDateInput1"}
                      className="filterDate"
                    />
                    <input
                      type="date"
                      value={this.state.filter.value2}
                      onChange={this.handleFilterChange}
                      id={"filterDateInput2"}
                      className="filterDate"
                    />
                  </div>
                )}
                {column.type === "select" && (
                  <select
                    id="filterSelect"
                    value={this.state.filter.value1}
                    onChange={this.handleFilterChange}
                  >
                    {FilterOptions}
                  </select>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Column);
