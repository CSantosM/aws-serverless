const uuid = require('uuid');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const ENTRIES_TABLE = 'entries';

const getAllEntries = () => {
    const params = {
        TableName: ENTRIES_TABLE
    };
    console.log("LLAMANDO A GET ALL ENTRY BD");


    return docClient.scan(params).promise();
};

const getEntry = (id) => {
    const params = {
		TableName: ENTRIES_TABLE,
		Key: {
			"entryId": id
		}
	};

	return docClient.get(params).promise();
};

const addEntry = (data) => {
    const params = {
        TableName: ENTRIES_TABLE,
        Item: {
            entryId: uuid.v1(),
            name: data.name,
            title: data.title,
			content: data.content,
			comments: data.comments
		}
    };

    return docClient.put(params).promise();
};

const updateEntry = (entry) => {
    const params = {
        TableName: ENTRIES_TABLE,
        Key: {
            entryId: entry.entryId
        },
        UpdateExpression: "set #na = :na, title = :t, content = :c, comments = :cm",
        ExpressionAttributeNames: {
            "#na": 'name'
        },
        ExpressionAttributeValues: {
            ":na": entry.name,
            ":t": entry.title,
			":c": entry.content,
			":cm": entry.comments
        },
        ReturnValues: "UPDATED_NEW"
    };

    return docClient.update(params).promise();
};

const deleteEntry = (entryId) => {
    const params = {
        TableName: ENTRIES_TABLE,
        Key: {
           entryId: entryId
        },
        ConditionExpression: "entryId = :entryId",
        ExpressionAttributeValues: {
            ":entryId": entryId
        },
        ReturnValues: "ALL_OLD"
    };

    return docClient.delete(params).promise();
};

const addComment = async (entryId, comment) => {
   var entry = await getEntry(entryId);
   const newComment = {
	   id: uuid.v1(),
	   message: comment.message
   };
   console.log(entry);
   entry.Item.comments.push(newComment);
   return updateEntry(entry.Item)
};

const deleteComment = async (entryId, commentId) => {

	var entry = await getEntry(entryId);
	var comment = entry.Item.comments.find(c => c.id === commentId );
	const index = entry.Item.comments.indexOf(comment);
	if (index > -1) {
		entry.Item.comments.splice(index, 1);
	}
	return updateEntry(entry.Item);
};

module.exports = {
	getAllEntries,
	getEntry,
    addEntry,
    updateEntry,
	deleteEntry,
	addComment,
	deleteComment
};