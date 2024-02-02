function getSessionErrorData(req,defaultData) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      ...defaultData
    };
  }

  req.session.inputData = null;

  return sessionInputData;
}

function flashErrorsToSession(req,data,action) {
  req.session.inputData = {
    hasError: true,
    ...data // title: data.title, content: data.content
  };

  req.session.save(action);
}

module.exports = {
  getSessionErrorData: getSessionErrorData,
  flashErrorsToSession: flashErrorsToSession,
};
