// Description:
//   Monitors Slack for swear words and inserts the appropriate amount into a swear jar
//   depending on the swear word. Also tracks lifetime stats for the swear jar for every user.
//
// Commands:
//   hubot swear jar [username] - Get swear jar stats for user, defaults to global leaderboard
//
// Authors:
//   agoedken

const swearjar = require('swearjar');

module.exports = function (robot) {
    const whitelist = [
        'giphy',
    ];

    const categories = {
        'insult'         : 1,
        'sexual'         : 2,
        'discriminatory' : 2,
        'inappropriate'  : 0.5,
        'blasphemy'      : 0.5,
    };

    // Retrieve swear jar information from the robot brain
    // if (robot.brain.get('swearJarInfo')) {
    //     swearJarInfo = robot.brain.get('swearJarInfo');
    // }

    let swearJarInfo = robot.brain.get('swearJarInfo') || {};

    // Checks every message sent for swear words and updates the swear jar
    robot.hear(/(.*)/i, function (msg) {
        let wordsInMessage = msg.match[1].split(' ');
        let name = msg.message.user.name.toLowerCase();

        // Checks each message for profanity
        if (!swearjar.profane(wordsInMessage)) return;

        // If profane, generates a sum of dollars to owe based on entire message
        let moneyOwed = 0;
        wordsInMessage.forEach(function (word) {
            if (!swearjar.profane(word)) return;
            // Checks each word for profanity
            // Gets back each category and generates an amount owed for this specific word
            let swearReport = swearjar.scorecard(word);
            for (let category in swearReport) {
                if (!swearReport.hasOwnProperty(category)) return;

                moneyOwed += categories[category] || 0;
            }
        });

        // Handles the case where the amount owed isn't an integer and adds an extra '0' to the output string
        let moneyOwedMsg = moneyOwed.toLocaleString(undefined, { style : 'currency', currency : 'USD' });

        // Alerts the user how much that message just cost them
        msg.send(`That's ${moneyOwedMsg} that you're putting in the swear jar, @${name}.`);

        // Makes sure the user has been entered into the swear jar before
        checkUserInSwearJar(name);

        // Updates the ongoing amount owed
        swearJarInfo[name] += moneyOwed;

        // Saves to brain for persistence
        robot.brain.set('swearJarInfo', swearJarInfo);
    });

    // Lists stats for specified user or global leaderboard if no user specified
    robot.respond(/swear jar (.*)|swear jar/i, function (msg) {
        // Retrieves name from message
        let name = msg.match[1];

        if (name && name.charAt(0) === '@') {
            name = name.substring(1);
        }

        // Check for the existence of a specified username, otherwise print global leaderboard
        if (name) {
            if (!checkUserInRoom(name) && !whitelist.includes(name)) {
                msg.send('Sorry, that user doesn\'t exist!');
                return;
            }

            checkUserInSwearJar(name);

            let moneyOwed = swearJarInfo[name];
            let moneyOwedMsg = moneyOwed.toLocaleString(undefined, { style : 'currency', currency : 'USD' });

            // Print out user stats
            msg.send(`@${name} owes ${moneyOwedMsg}.`);
            return;
        }

        let scoreboard = [];

        let swearJarJSON = JSON.parse(JSON.stringify(swearJarInfo));
        let swearJarArray = [];

        for (let user in swearJarJSON) {
            if (!swearJarJSON.hasOwnProperty(user)) continue;

            swearJarArray.push({
                user      : user,
                moneyOwed : swearJarJSON[user],
            });
        }

        swearJarArray.sort((a, b) => (b.moneyOwed - a.moneyOwed));

        for (let i = 0; i < swearJarArray.length; i++) {
            let userObj = swearJarArray[i];
            let moneyOwedMsg = userObj.moneyOwed.toLocaleString(undefined, { style : 'currency', currency : 'USD' });

            scoreboard.push(`${i + 1}. ${userObj.user} ${moneyOwedMsg}`);
        }

        let messageText = scoreboard.join('\n');

        msg.send({ 'attachments' : [{ 'text' : messageText }] });
    });

    /**
     * Checks if the user specified is a valid user in the given room.
     * @param {string} name The name of the user.
     * @returns {boolean} True if valid user, false otherwise.
     */
    function checkUserInRoom(name) {
        if (!robot.brain.data.users) return;

        for (let user in robot.brain.data.users) {
            if (!robot.brain.data.users.hasOwnProperty(user)) continue;

            if (name.toLowerCase() === robot.brain.data.users[user].name.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if user has sworn before. If not, create stats for user.
     * @param {String} name The name of the user to check
     */
    function checkUserInSwearJar(name) {
        swearJarInfo[name] = swearJarInfo[name] || 0;
        robot.brain.set('swearJarInfo', swearJarInfo);
    }
};
