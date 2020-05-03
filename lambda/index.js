'use strict';

const db = require('./db');

exports.entriesHandler = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'GET':
            if(event.pathParameters && event.pathParameters.entryId){
                getEntry(event.pathParameters.entryId, callback);
                return;
            }
            getAllEntries(callback);
            break;
        case 'POST':
            if(event.pathParameters && event.pathParameters.entryId) {
                addComment(event.pathParameters.entryId, event.body, callback);
                return;
            }
            addEntry(event.body, callback);
            break;
        case 'PUT':
            updateEntry(event.pathParameters.entryId, event.body, callback);
            break;
        case 'DELETE':
            if(event.pathParameters && event.pathParameters.commentId) {
                deleteComment(event.pathParameters.entryId, event.pathParameters.commentId, callback);
                return;
            }
            deleteEntry(event.pathParameters.entryId, callback);
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const getAllEntries = (callback) => {
    db.getAllEntries().then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const getEntry = (id, callback) => {
    db.getEntry(id).then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const addEntry = (entry, callback) => {
    entry = JSON.parse(entry);

    db.addEntry(entry).then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const updateEntry = (entryId, entry, callback) => {
    entry = JSON.parse(entry);
    entry.entryId = entryId;

    db.updateEntry(entry).then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const deleteEntry = (entryId, callback) => {
    db.deleteEntry(entryId).then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const addComment = (entryId, comment, callback) => {
    comment = JSON.parse(comment);

    db.addComment(entryId, comment).then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const deleteComment = (entryId, commentId, callback) => {
    db.deleteComment(entryId, commentId).then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};