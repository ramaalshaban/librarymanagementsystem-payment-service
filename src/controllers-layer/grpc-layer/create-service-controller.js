const PaymentServiceGrpcController = require("./PaymentServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new PaymentServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};
