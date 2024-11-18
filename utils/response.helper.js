class response {
  // success response status:200
  success(res, msg = "success", data = null) {
    return res.status(200).json({
      status: "success",
      message: msg,
      innerData: data,
    });
  }

  // Not found response status:404
  notFound(res, msg = "Not found", data = null) {
    return res.status(404).json({
      status: "warning",
      message: msg,
      innerData: data,
    });
  }

  // forbidden
  forbidden(res, msg = "Forbidden", data = null) {
    return res.status(403).json({
      status: "error",
      message: msg,
      innerData: data,
    });
  }

  // server error
  serverError(res, msg = "Internal server error", data = null) {
    return res.status(500).json({
      status: "error",
      message: msg,
      innerData: data,
    });
  }

  // error
  error(res, msg = "error", data = null) {
    return res.status(400).json({
      status: "error",
      message: msg,
      innerData: data,
    });
  }
}

module.exports = new response();
