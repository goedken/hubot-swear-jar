// Description:
//   Monitors Slack for swear words and inserts the appropriate amount into a swear jar
//   depending on the swear word. Also tracks lifetime stats for the swear jar for every user.
//
// Commands:
//   hubot swear jar [username] - Get swear jar stats for user, defaults to global leaderboard
//
// Authors:
//   agoedken

const sj = require('swearjar');

module.exports = function (robot) {
    let swearJarInfo = {};

    let categories = {
        'insult'         : 1,
        'sexual'         : 2,
        'discriminatory' : 2,
        'inappropriate'  : 0.5,
        'blasphemy'      : 0.5,
    };

    // Retrieve swear jar information from the robot brain
    if (robot.brain.get('swearJarInfo')) {
        swearJarInfo = robot.brain.get('swearJarInfo');
    }

    // Checks every message sent for swear words and updates the swear jar
    robot.hear(/(.*)/i, function (msg) {
        let message = msg.match[1].split(' ');
        let name = msg.message.user.name.toLowerCase();

        // Checks each message for profanity
        if (sj.profane(message)) {
            // If profane, generates a sum of dollars to owe based on entire message
            let moneyOwed = 0;
            message.forEach(function (word) {
                // Checks each word for profanity
                if (sj.profane(word)) {
                    // Gets back each category and generates an amount owed for this specific word
                    let swearReport = sj.scorecard(word);
                    for (let cat in swearReport) {
                        if (Object.prototype.hasOwnProperty.call(swearReport, cat)) {
                            if (categories[cat]) {
                                moneyOwed += categories[cat];
                            }
                        }
                    }
                }
            });

            // Handles the case where the amount owed isn't an integer and adds an extra '0' to the output string
            let moneyOwedMsg = formatMessage(moneyOwed);

            // Alerts the user how much that message just cost them
            msg.send('That\'s $' + moneyOwedMsg + ' that you\'re putting in the swear jar, @' + name + '.');

            // Makes sure the user has been entered into the swear jar before
            checkUser(name);

            // Updates the ongoing amount owed
            swearJarInfo[name] += moneyOwed;

            // Saves to brain for persistence
            robot.brain.save(swearJarInfo);
        }
    });

    // Lists stats for specified user or global leaderboard if no user specified
    robot.respond(/swear jar (.*)|swear jar/i, function (msg) {
        // Retrieves name from message
        let name = msg.match[1];

        // Check for the existence of a specified username, otherwise print global leaderboard
        if (name) {
            checkUser(name);

            let moneyOwed = swearJarInfo[name];
            let moneyOwedMsg = formatMessage(moneyOwed);

            // Print out user stats
            msg.send('@' + name + ' owes: $' + moneyOwedMsg + '.');
        } else {
            for (let user in swearJarInfo) {
                if (Object.prototype.hasOwnProperty.call(swearJarInfo, user)) {
                    let moneyOwed = swearJarInfo[user];
                    let moneyOwedMsg = formatMessage(moneyOwed);
                    msg.send('@' + user + ' owes $' + moneyOwedMsg + '\n');
                }
            }
        }
    });

    /**
     * Formats the money owed amount to end in a zero (if not an integer) and
     * to print with commas every thousand.
     * @param {number} moneyOwed The amount that's owed and needs to be formatted
     * @returns {String} moneyOwedMsg The formatted string to print
     */
    function formatMessage(moneyOwed) {
        let moneyOwedMsg = moneyOwed;
        if (!Number.isInteger(moneyOwed)) {
            moneyOwedMsg = moneyOwedMsg + '0';
        }
        moneyOwedMsg = moneyOwedMsg.toLocaleString();

        return moneyOwedMsg;
    }

    /**
     * Checks if user has sworn before. If not, create stats for user.
     * @param {String} name The name of the user to check
     */
    function checkUser(name) {
        if (!swearJarInfo[name]) {
            swearJarInfo[name] = 0;
        }
        robot.brain.save(swearJarInfo);
    }
};
