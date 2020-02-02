var PROTO_PATH = __dirname + '/../protos/helloworld.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  // call 是 gRPC 给封装好的对象
  // callback 是client要执行的回调
  // request对象中,只有message中定义的字段
  console.log(call.request)
  // callback 第一个参数,如果报错可以传入 error
  let err = null
  callback(err, { message: 'Hello ' + call.request.name });
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, { sayHello: sayHello });
  server.bind('0.0.0.0:50055', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
