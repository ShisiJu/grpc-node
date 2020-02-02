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


function main() {
  // 创建端口号 和 credentials
  var client = new hello_proto.Greeter('localhost:50055',
    grpc.credentials.createInsecure());
  var user = 'world';

  // client.sayHello(call,callback)
  client.sayHello({ name: user }, function (err, response) {
    // callback的 err 是server 来返回的 如果无 null 说明无错误
    if (err === null) {
      // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
    }
    // server端给返回的数据 response
    console.log('Greeting:', response);
    console.log(response)
  });
}

main();
