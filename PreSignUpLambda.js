const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient({ region: `<Your-AWS-Region>` });

exports.handler = async (event, context) => {
  console.log("Running presignup lambda...");
  console.log("processing event: %j", event);

  const TableName = "<TableName>";
  const IndexName = "<IndexName>";
  
  //You need to pass the value that you would like to check for in to the Lambda function via a custom attribute!
  const userAttributes = event.request.userAttributes;
  const username = userAttributes["custom:submittedUsername"];
  console.log("username from event: " + username);
  
  var params = {
    TableName: TableName,
    IndexName: IndexName,
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username
    }
  };

  try {
    const res = await dynamo.query(params).promise();
    if (res.Items.length !== 0) {
      throw "Username already exists!";
    }
    context.done(null, event);
  } catch (error) {
    console.log("Error!: " + error);
    return context.done(error, event)
  }
};
