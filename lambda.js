const gradients = require('./gradients.json');
const gradientsNofilter = require('./gradientsNoFilter.json');

const chunk = (array, chunk = 2) => {
    return array.reduce((c, v, i, a) => {
        if (i + chunk <= a.length) {
            c.push(a.slice(i, i + chunk));
        }

        return c;
    }, []);
};

exports.handler = async event => {
    let result = gradients;
    let {
        queryStringParameters
    } = event;

    let {
        angle = '225',
            filter = '',
            operator = 'or'
    } = queryStringParameters || {};

    angle = Number(angle);

    if (isNaN(angle)) {
        angle = 0;
    }

    if (
        filter &&
        typeof filter === 'string'
    ) {
        filter = filter.split(',')
            .map(filter => {
                return filter.trim();
            });

        const filterChunk = operator === 'and' ? chunk(filter, 2) : [];

        console.log(filterChunk);

        result = result.filter(colors => {
            if (operator === 'and') {
                return filterChunk.some(filter => {
                    return filter.every(filter => {
                        return colors[0].key === filter ||
                            colors[1].key === filter;
                    }) || filter.some(filter => {
                        return colors[0].key === filter &&
                            colors[0].key === colors[1].key;
                    });
                });
            }

            return filter.some(filter => {
                return colors[0].key === filter ||
                    colors[1].key === filter;
            });
        });
    } else {
        result = gradientsNofilter;
    }

    result = result.map(colors => {
        return {
            angle,
            key: `${colors[0].key}-${colors[0].shade}-${colors[1].key}-${colors[1].shade}`,
            keys: colors[0].key === colors[1].key ? [
                colors[0].key
            ] : [
                colors[0].key,
                colors[1].key
            ],
            stops: [{
                color: colors[0].color,
                offset: 0,
                opacity: 1,
                id: 1
            }, {
                color: colors[1].color,
                offset: 1,
                opacity: 1,
                id: 2
            }],
            preview: `linear-gradient(${angle}deg, ${colors[0].color} 0%, ${colors[1].color} 100%)`
        };
    });

    return {
        body: JSON.stringify(result),
        headers: {
            'content-type': 'application/json'
        },
        statusCode: 200
    };
};

(async () => {
    let result = await exports.handler({
        queryStringParameters: {
            filter: 'red,orange,lime',
            operator: 'and'
        }
    });

    result = JSON.parse(result.body);

    console.log(result);
})();