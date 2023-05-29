const { DynamoDB } = require('aws-sdk');

exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    
    const dynamo = new DynamoDB();

    let body = JSON.parse(event.body);

    if (body.id){
        await dynamo.updateItem({
            TableName: process.env.HITS_TABLE_NAME,
            Key: { id: { S: body.id } },
            UpdateExpression: 'SET is_shipped = :isShipped',
            ExpressionAttributeValues: { ':isShipped': { BOOL: true } }
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
        message: "send a body with a previous existing id to upload the shipping status"
    };

    return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorBodyResponse)
      };
};