import React, { Component } from "react";
import "./App.css";
import Spreadsheet from "./components/spreadsheet/Spreadsheet";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spreadsheet: false
    };
  }

  createSpreadsheet = () => {
    this.setState({ spreadsheet: true });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Spreadsheet</h1>
        </header>
        {this.state.spreadsheet ? (
          <Spreadsheet />
        ) : (
          <div>
            <p className="App-intro">
              To get started, click the 'create spreadsheet' button.
            </p>
            <button onClick={this.createSpreadsheet}>Create spreadsheet</button>
          </div>
        )}
      </div>
    );
  }
}
export default App;
