const _ = require('lodash');
const colors = require('tailwindcss/colors');

module.exports = () => {
    return _.reduce({
        'red': colors.red,
        'orange': colors.orange,
        'amber': colors.amber,
        'yellow': colors.yellow,
        'lime': colors.lime,
        'green': colors.green,
        'emerald': colors.emerald,
        'teal': colors.teal,
        'cyan': colors.cyan,
        'light-blue': colors.lightBlue,
        'blue': colors.blue,
        'indigo': colors.indigo,
        'violet': colors.violet,
        'purple': colors.purple,
        'fuchsia': colors.fuchsia,
        'pink': colors.pink,
        'rose': colors.rose
    }, (reduction, shades, color) => {
        reduction[color] = _.map(shades, (value, shade) => {
            return {
                color,
                shade: Number(shade),
                value
            };
        });
        
        return reduction;
    }, {});
};