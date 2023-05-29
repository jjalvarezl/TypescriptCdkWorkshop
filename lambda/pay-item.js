const { DynamoDB } = require('aws-sdk');

exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    
    const dynamo = new DynamoDB();

    let body = JSON.parse(event.body);

    if (body.id && body.name){
        await dynamo.updateItem({
            TableName: process.env.HITS_TABLE_NAME,
            Key: { id: { S: body.id } },
            UpdateExpression: 'SET product_name = :name, is_shipped = :isShipped',
            ExpressionAttributeValues: { ':name': { S: body.name }, ':isShipped': { BOOL: false } }
          }).promise();

        const bodyResponse = {
            message: "Success!"
        };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyResponse)
        };
    }

    const errorBodyResponse = {
        message: "send a body with id and name"
    };

    return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorBodyResponse)
      };
};