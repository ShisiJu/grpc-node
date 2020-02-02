# gRPC

代码放在了 GitHub上

[https://github.com/ShisiJu/grpc-node](https://github.com/ShisiJu/grpc-node)

## protobuf

`gRPC` 有一套自己的编写格式; 就是 `protocol buffers` 

具体的格式定义可以看官网 (需要翻墙)

[https://developers.google.com/protocol-buffers/docs/overview](https://developers.google.com/protocol-buffers/docs/overview)

我们需要按照规定地格式来, 定义 `service` 和 `message` 

下面这个例子, 可以看一下

``` js
syntax = "proto3";

package helloworld;

// The greeting service definition.
service Greeter {
    // Sends a greeting
    rpc SayHello(HelloRequest) returns(HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
    string name = 1;
    int32 age = 2;
}

// The response message containing the greetings
message HelloReply {
    string message = 1;
    // 这里我没有定义 age,那么response中也不会有
}
```

服务的名称, 和调用的方法中的参数和参数的字段都是通过上面的代码指定的; 

## node

通过定义 proto , 我们之后可以使用 gRPC 来试着做个例子

服务所在的系统是 `server` 
要调用的系统是 `client` 

无论 server 还是 client , 这两者都需要 `proto` 文件; 
需要定义的service和message; 

下面的代码是server和client 开头共有的

``` js
var PROTO_PATH = __dirname + '/../protos/helloworld.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
```

### server

我们先在 server端定义一个和 proto中相同的方法 `sayHello` , 
并创建一个 gRPC 的 server

``` js
function sayHello(call, callback) {
    // call 是 gRPC 给封装好的对象
    // callback 是client要执行的回调
    // request对象中,只有 HelloRequest 中定义的字段
    console.log(call.request)
    // callback 第一个参数,如果报错可以传入 error
    let err = null
    // callback 第二个参数,返回的字段也和 HelloReply 相同
    callback(err, {
        message: 'Hello ' + call.request.name
    });
}
```

之后我们应该创建一个 gRPC的服务器

``` js
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {
      sayHello: sayHello
  });
  // 这里绑定的地址要和client请求的一致
  server.bind('0.0.0.0:50055', grpc.ServerCredentials.createInsecure());
  server.start();
```

避免不必要的篇幅, server和之后的 client 的全部代码在github上了

[https://github.com/ShisiJu/grpc-node](https://github.com/ShisiJu/grpc-node)

### client 

服务端定义好了方法之后, 我们要请求服务器
 

``` js
  // 指定地址和端口号
  var client = new hello_proto.Greeter('localhost:50055',
      grpc.credentials.createInsecure());
  var user = 'world';

  // client.sayHello(call,callback)
  client.sayHello({
      name: user,
      age: 'no'
  }, function(err, response) {
      // callback的 err 是server 来返回的 如果无 null 说明无错误
      if (err === null) {
          // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
      }
      // server端给返回的数据 response 和 HelloReply 定义的一样
      console.log('Greeting:', response);
  });
```

其中 传入参数要注意:

client 传入

``` json
{ name: "world", age: 'no'  }
```

`age` 应该是个数字, 而非字符串

server 接受的 request中会得到

``` json
{name: "world", age: 0}
```

记住: 没有传入的参数, 或者传入的值不对的; 
都会变成默认值; 

