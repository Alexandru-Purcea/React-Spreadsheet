const addRows = properties => dispatch => {
  dispatch({
    type: "ADD_ROWS",
    payload: {
      number: properties.number
    }
  });
};

export { addRows };
