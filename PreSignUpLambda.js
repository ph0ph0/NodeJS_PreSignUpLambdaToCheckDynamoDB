const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient({ region: `us-east-1` });

exports.handler = async (event, context) => {
  console.log("Running presignup lambda...");
  console.log("processing event: %j", event);

  const TableName = "User-or2wpavvmbatbhfn7vwoynk4c4-dev";
  const IndexName = "findUsername";

  const username = event.request.validationData.username
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
