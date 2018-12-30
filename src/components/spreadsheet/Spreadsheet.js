import React, { Component } from "react";
import { connect } from "react-redux";
import { createColumn } from "../../actions/createColumn";
import Column from "../column/Column.component";
import "./Spreadsheet.css";
import { addRows } from "../../actions/addRows";
let columns = [];

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  createColumn: payload => dispatch(createColumn(payload)),
  addRows: payload => dispatch(addRows(payload))
});

class Spreadsheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: true,
      columnCounter: 1,
      newColumn: false,
      columnTitle: "",
      cellsType: "date",
      rows: 10,
      required: false,
      select: {
        active: false,
        currentValue: "",
        options: []
      }
    };
  }

  createColumn = () => {
    this.setState({ newColumn: true });
  };

  addRows = () => {
    this.setState({ rows: this.state.rows + 10 }, () =>
      this.props.addRows({
        number: this.state.rows
      })
    );
  };

  handleInputChange = event => {
    const target = event.target;
    if (target.type === "select-one") {
      this.setState({ cellsType: target.value });
      if (target.value === "select") {
        this.setState({
          select: {
            active: true,
            currentValue: "",
            options: []
          }
        });
      }
    } else if (target.type === "text") {
      this.setState({ columnTitle: event.target.value });
    } else if (target.type === "checkbox") {
      this.setState({ required: target.checked });
    }
  };
  handleSelectChange = event => {
    this.setState({
      select: { ...this.state.select, currentValue: event.target.value }
    });
  };
  handleSelectSubmit = event => {
    event.preventDefault();
    let options = this.state.select.options;
    options.push(this.state.select.currentValue);
    this.setState({
      select: {
        ...this.state.select,
        currentValue: "",
        options: options
      }
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let { columnTitle, cellsType, required, columnCounter } = this.state;
    let select = this.state.select;
    if (select.active) {
      if (select.options[0]) {
        this.props.createColumn({
          title: columnTitle,
          type: cellsType,
          defaultValue: select.options[0],
          id: ["Column" + columnCounter],
          options: select.options,
          required: required
        });
      } else {
        alert("Please enter at least 1 option");
      }
    } else {
      this.props.createColumn({
        title: this.state.columnTitle,
        type: this.state.cellsType,
        defaultValue: "",
        id: ["Column" + this.state.columnCounter],
        required: this.state.required
      });
    }
    if (!select.active || select.options[0]) {
      columns.push(this.state.columnTitle);
      let counter = this.state.columnCounter;
      counter++;
      this.setState({
        initial: false,
        required: false,
        columnCounter: counter,
        newColumn: false,
        columnTitle: "",
        cellsType: "date",
        select: {
          ...this.state.select,
          active: false
        }
      });
    }
  };
  render() {
    let state = this.state;
    let ColumnComponents = [];
    let store = this.props.reducer;
    for (var key in store) {
      if (store.hasOwnProperty(key)) {
        if (store[key]["type"]) {
          ColumnComponents.push(
            <Column
              title={store[key]["title"]}
              id={store[key]["id"]}
              type={store[key]["type"]}
              options={store[key]["options"]}
              key={store[key]["id"]}
            />
          );
        }
      }
    }

    let options = [];
    if (state.select.options[0] && state.select.active) {
      for (let i = 0; i < state.select.options.length; i++) {
        options.push(
          <li key={state.select.options[i] + i}>{state.select.options[i]}</li>
        );
      }
    }
    return (
      <div>
        <div id="spreadsheetContainer">
          {!this.state.initial && ColumnComponents}
          {!this.state.newColumn && (
            <button onClick={this.createColumn} id="newColumnButton">
              New column
            </button>
          )}
          {this.state.newColumn && (
            <div className="flex">
              {this.state.newColumn && (
                <div id="createColumnContainer">
                  <form onSubmit={this.handleSubmit} id="createColumnForm">
                    <label>
                      Title:
                      <input
                        type="text"
                        value={this.state.columnTitle}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    {!this.state.select.active && (
                      <label>
                        Cells type:
                        <select
                          value={this.state.cellsType}
                          onChange={this.handleInputChange}
                        >
                          <option value="date">Date</option>
                          <option value="select">Select</option>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                        </select>
                      </label>
                    )}
                    <input type="submit" value="Submit" />
                  </form>
                  {this.state.select.active && (
                    <form onSubmit={this.handleSelectSubmit}>
                      <label>
                        Add options:
                        <input
                          type="text"
                          value={this.state.select.currentValue}
                          onChange={this.handleSelectChange}
                          id={"optionsInput"}
                        />
                      </label>
                      <ul>{options}</ul>
                    </form>
                  )}
                  <label>
                    Required:
                    <input
                      name="Required"
                      type="checkbox"
                      checked={this.state.required}
                      onChange={this.handleInputChange}
                      id="requiredCheckbox"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        {!this.state.initial && (
          <button onClick={this.addRows}>Add 10 rows</button>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Spreadsheet);
