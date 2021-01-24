const Combinatorics = require('./Combinatorics');
const colors = require('./colors.json');
const gradientsNofilter = require('./gradientsNoFilter.json');

exports.handler = async event => {
    let result = [];
    let {
        queryStringParameters
    } = event;

    let {
        angle = '135',
        filter = '',
        minShade = '100',
        maxShade = '900'
    } = queryStringParameters || {};

    angle = Number(angle);
    minShade = Number(minShade);
    maxShade = Number(maxShade);

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

        let pickedColors = filter.reduce((reduction, filter) => {
            return reduction.concat(colors[filter] || []);
        }, []);

        pickedColors = pickedColors.filter(color => {
            return color.shade >= minShade &&
                color.shade <= maxShade;
        });

        let c;
        let combinations = [];
        let cmb = Combinatorics.bigCombination(pickedColors, 2);

        while ((c = cmb.next())) {
            const same = c[0].color === c[1].color;
            const shadeDelta = Math.abs(c[0].shade - c[1].shade);

            if (
                same &&
                shadeDelta <= 100
            ) {
                continue;
            }

            combinations = combinations.concat([c]);
        }

        result = combinations;
    } else {
        result = gradientsNofilter;
    }

    result = result.map(colors => {
        return {
            angle,
            key: `${colors[0].color}-${colors[1].color}-${colors[0].shade}-${colors[1].shade}`,
            colors: colors[0].color === colors[1].color ? [
                colors[0].color
            ] : [
                colors[0].color,
                colors[1].color
            ],
            stops: [{
                color: colors[0].value,
                offset: 0,
                opacity: 1,
                id: 1
            }, {
                color: colors[1].value,
                offset: 1,
                opacity: 1,
                id: 2
            }],
            preview: `linear-gradient(${angle}deg, ${colors[0].value} 0%, ${colors[1].value} 100%)`
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