exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    var html = '<html><head><title>Hello user from API Gateway/Lambda</title></head>' + 
        '<body><h1>Hello user from API Gateway/Lambda</h1></body></html>';

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: html
      };
};