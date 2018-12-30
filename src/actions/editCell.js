const editCell = properties => dispatch => {
  dispatch({
    type: "EDIT_CELL",
    payload: {
      column: properties.column,
      index: properties.index,
      value: properties.value
    }
  });
};

export { editCell };
