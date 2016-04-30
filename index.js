/**
 * this code is based for https://gist.github.com/andrewtamura/81cb43f86f332be46187
 */

var request = require('request');
var util = require('util');

var slackWebhookUrl = 'SLACK_WEBHOOK_URL';

exports.handler = function(event, context) {
    console.log('input', event);
    var data = convertModulusWebhook(event);
    var options = {
        method: 'post',
        body: data,
        json: true,
        url: slackWebhookUrl
    };
    console.log('options', options);
    request(options, context.done);
};

/*  convert a Modulus webhook into a slack webhook
 */
var convertModulusWebhook = function(data) {

    var text = util.format('%s: %s', data.type, data.project.name)
    var textLong = util.format("project '%s' has been %sed", data.project.name, data.type)

    var slackEvent = {
        'username': "modulus.io",
        'icon_url': "https://modulus.io/img/modulus_icon_200.png",
        "pretext": text,

        'color': getStatusColor(data.type),

        "fields": [
            {
                //"title": text, // The title may not contain markup and will be escaped for you
                "value": textLong,
                "short": false // Optional flag indicating whether the `value` is short enough to be displayed side-by-side with other values
            }
        ],
    };

    if (data.servo && data.servo.log) {
        slackEvent.fields.push(
            {
                "value": data.servo.log,
                "short": false
            }
        );
    }

    return slackEvent;

};

/**
 *
 * @param data
 * @returns {{title: string, text: *, short: boolean}}
 */
var buildCrashAttachment = function(data) {
    if (data.type === 'crash' && data.servo) {
        return {
            'title': 'Modulus Alert',
            'text': data.servo.log,
            'short': false
        };
    } else {
        return {
            'title': 'Modulus Alert',
            'text': data.project.name,
            'short': false
        };
    }
};

/*  returns a Slack color depending on the modulus event type. Crash should be red, deploy should be
 *  green, and everything else will be orange.
 */
var getStatusColor = function(eventType) {
    if (eventType === 'crash') {
        return 'danger';
    } else if (eventType === 'deploy') {
        return 'good';
    } else {
        return 'warning';
    }
};