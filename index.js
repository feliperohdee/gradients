const _ = require('lodash');
const Combinatorics = require('js-combinatorics');
const colors = require('tailwindcss/colors');

let i = 0;
let dump = [];
let size = '150px';
let allowSame = true;
let maxColorDelta = 5;
let minShadeDeltaForSameColor = 100;
let allColors = _.flatMap({
    red: colors.red,
    orange: colors.orange,
    amber: colors.amber,
    yellow: colors.yellow,
    lime: colors.lime,
    green: colors.green,
    emerald: colors.emerald,
    teal: colors.teal,
    cyan: colors.cyan,
    lightBlue: colors.lightBlue,
    blue: colors.blue,
    indigo: colors.indigo,
    violet: colors.violet,
    purple: colors.purple,
    fuchsia: colors.fuchsia,
    pink: colors.pink,
    rose: colors.rose
}, (shades, key) => {
    const result = _.reduce(shades, (reduction, color, shade) => {
        shade = Number(shade);

        if (
            shade === 50 ||
            shade === 100 ||
            shade === 200 ||
            // shade === 300 ||
            // shade === 400 ||
            // shade === 500 ||
            // shade === 600 ||
            // shade === 700 ||
            // shade === 800 ||
            shade === 900
        ) {
            return reduction;
        }

        if (
            (key === 'red' && shade === 300) ||
            (key === 'red' && shade === 400) ||
            (key === 'orange' && shade === 300) ||
            (key === 'orange' && shade === 400) ||
            (key === 'amber' && shade === 300) ||
            (key === 'amber' && shade === 400) ||
            (key === 'lime' && shade === 300) ||
            (key === 'green' && shade === 300) ||
            (key === 'blue' && shade === 300) ||
            (key === 'indigo' && shade === 300) ||
            (key === 'violet' && shade === 300) ||
            (key === 'purple' && shade === 300) ||
            (key === 'fuchsia' && shade === 300) ||
            (key === 'pink' && shade === 300)
        ) {
            return reduction;
        }

        return reduction.concat({
            key: _.kebabCase(key),
            color,
            colorIndex: i,
            shade
        });
    }, []);

    i++;

    return result;
});

let cmb = Combinatorics.bigCombination(allColors, 2);

while (c = cmb.next()) {
    const same = c[0].key === c[1].key;
    const shadeDelta = Math.abs(c[0].shade - c[1].shade);
    const colorDelta = Math.abs(c[0].colorIndex - c[1].colorIndex);

    if ((
            same &&
            !allowSame
        ) || (
            same && shadeDelta <= minShadeDeltaForSameColor
        ) || (
            colorDelta > maxColorDelta
        )) {
        continue;
    }

    dump = dump.concat([c]);
}

dump = _.map(dump, colors => {
    return `
        <div style="width:${size};height:${size};padding:5px;">
            <div style="display:flex;align-items:center;justify-content:center;background:linear-gradient(225deg,${colors[0].color} 0%,${colors[1].color} 100%);width:100%;height:100%;border-radius:100%;">
                <div>
                    ${colors[0].key}-${colors[0].shade}
                    <br/>
                    ${colors[1].key}-${colors[1].shade}
                </div>
            </div>
        </div>
    `;
});

console.log(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rohde Sites Gradients</title>
    </head>
    <body>
        <div style="display:flex;justify-content:center;flex-wrap:wrap;color:#fff;font-family:monospace;text-align:center;">
            ${dump.join('')}
        </div>
    </body>
    </html>
`);