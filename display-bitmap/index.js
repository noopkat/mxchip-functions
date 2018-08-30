var Client = require('azure-iothub').Client;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (!(req.body && req.body.bitmap)) {
        context.res = {
            status: 400,
            body: "Please pass a bitmap on the query string or in the request body"
        };
        context.done();
    }
    var connectionString = req.body.connectionString || process.env.IoTConnectionString;
    var methodName = 'showBitmap';
    var deviceId = req.body.deviceId || process.env.DeviceId;


    var client = Client.fromConnectionString(connectionString);

    var bitmapBuf = Buffer.from(req.body.bitmap);

    var methodParams = {
        methodName: 'showBitmap',
        payload: bitmapBuf,
        timeoutInSeconds: 30
    };

    context.log(methodParams);

    client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
    // { type: 'Buffer', data: [ 255, 222 ] }
        if (err) {
            var error = 'Failed to invoke method \'' + methodName + '\': ' + err.message;

            context.res = {
                status: 500,
                body: error 
            };
        } else {
            console.log(methodName + ' on ' + deviceId + ':');
            console.log(JSON.stringify(result, null, 2));

            context.res = {
                status: 200,
                body: "ok!" 
            };
        }

        context.done();
    });


};
