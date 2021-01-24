const {
    handler
} = require('./lambda');

(async () => {
    let result = await handler({
        queryStringParameters: {
            filter: 'orange'
        }
    });

    result = JSON.parse(result.body);

    result.forEach(r => {
        return console.log(r.key);
    });
})();