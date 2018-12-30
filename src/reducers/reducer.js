export default (
  state = {
    numberOfRows: 10,
    IndexColumn: {
      title: "",
      type: "text",
      rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      id: "IndexColumn"
    }
  },
  action
) => {
  switch (action.type) {
    case "CREATE_COLUMN":
      let rows = [];
      for (let i = 0; i < state.numberOfRows; i++) {
        if (action.payload.type !== "date") {
          rows.push(action.payload.defaultValue);
        } else {
          rows.push("");
        }
      }
      return {
        ...state,
        [action.payload.id]: {
          title: action.payload.title,
          type: action.payload.type,
          id: action.payload.id,
          rows: rows,
          options: action.payload.options,
          required: action.payload.required
        }
      };
    case "EDIT_CELL":
      let { column, index, value } = action.payload;
      if (index === "title" && column !== "IndexColumn") {
        console.log(column);
        console.log(index);
        state[column].title = value;
      } else if (column !== "IndexColumn") {
        state[column].rows[index] = value;
      }
      return {
        ...state
      };
    case "ADD_ROWS":
      state.numberOfRows = action.payload.number;
      for (var key in state) {
        if (state.hasOwnProperty(key)) {
          if (state[key]["rows"]) {
            let prevIndex = state[key].rows[state.numberOfRows - 11];
            while (state[key]["rows"].length < state.numberOfRows) {
              if (key === "IndexColumn") {
                prevIndex++;
                state[key]["rows"].push(prevIndex);
              } else state[key]["rows"].push("");
            }
          }
        }
      }
      return {
        ...state
      };

    default:
      return state;
  }
};
