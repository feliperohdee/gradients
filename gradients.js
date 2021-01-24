const _ = require('lodash');
const colors = require('tailwindcss/colors');
const Combinatorics = require('js-combinatorics');

module.exports = (args = {}) => {
    const {
        allowSame = true,
        maxColorDelta = Infinity,
        minShadeDeltaForSameColor = 100
    } = args;

    let colorIndex = 0;
    let colorsCombinations = [];
    let tailwindColors = _.flatMap({
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
                (key === 'orange' && shade === 300) ||
                (key === 'amber' && shade === 300) ||
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
                colorIndex,
                shade
            });
        }, []);

        colorIndex++;

        return result;
    });

    let cmb = Combinatorics.bigCombination(tailwindColors, 2);
    let c;

    while ((c = cmb.next())) {
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

        colorsCombinations = colorsCombinations.concat([c]);
    }

    return colorsCombinations;
};