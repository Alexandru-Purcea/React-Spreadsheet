const createColumn = properties => dispatch => {
  dispatch({
    type: "CREATE_COLUMN",
    payload: {
      type: properties.type,
      title: properties.title,
      defaultValue: properties.defaultValue,
      id: properties.id,
      options: properties.options,
      required: properties.required
    }
  });
};
export { createColumn };
