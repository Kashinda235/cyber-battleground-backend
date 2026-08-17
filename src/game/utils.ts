export interface Action {
    actionType: string;
    targetId: number;
    abilityId: number;
}

export interface Mail {
    receiverId: number;
    message: string;
    phishingPayload: boolean;
}

// Utility helper to pick a random item from an array
const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

// Utility helper to pick a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const botUtils = {
    delay (ms: number) {
        new Promise((resolve) => setTimeout(resolve, ms));
    },

    getRandomChat (): string {
        const chatPool = [
            "gg everyone!",
            "Anyone down to form a party?",
            "Watch out, not all mails are safe.",
            "brb getting some snacks",
            "Don't forget to change your passwords",
            "I got a massive reward in the mail",
            "gl hf!",
            "Hey i just mailed you",
            "afk 2 mins",
            "Nice play!",
            "Need help",
            "near!",
            "lol standard",
            "do you guy's watch anime",
            "I love spider man",
            "the new Avengers movie is coming",
            "I am BATMAN",
            "global chat.. huh",
            "This project really utilises the webSockets",
            "Awesome man!",
            "it reminds me of the COC global chat",
            "Are there any girls!",
            "Hi from India!",
            "BINOD ... lol",
            "good morning guys...",
        ];

        return getRandomElement(chatPool);
    },

    getRandomMail (validPlayerIds: number[] = [1]): Mail {
        const receiverId = getRandomElement(validPlayerIds);
        const isPhishing = Math.random() < 0.5; // 50% chance for a phishing attempt vs friendly email

        const welcomingMessages = [
            "Welcome to the server! Let me know if you need any basic gear to get started.",
            "Hey! Saw you joined recently. Feel free to reach out if you have questions.",
            "Welcome aboard! Don't forget to check out the quest board in town.",
            "Glad to have you in the game! Good luck out there.",
        ];

        const phishingMessages = [
            "ALERT: Your account security is at risk. Click here to verify your password immediately: http://bit.ly/secure-game-login",
            "CONGRATULATIONS! You won 10,000 free gold coins! Claim here: http://claim-free-coins.net",
            "System Update required. Please re-enter your credentials to avoid temporary suspension.",
            "URGENT: Rare item transfer pending. Verify your identity now to accept: http://game-trade-auth.com",
        ];

        const message = isPhishing
            ? getRandomElement(phishingMessages)
            : getRandomElement(welcomingMessages);

        return {
            receiverId,
            message,
            phishingPayload: isPhishing,
        };
    },

    getRandomAction (validPlayerIds: number[] = [1]): Action {
        const actionTypes = ["LOGIN", "PORT", "DEFEND", "SCAN", "PATROL"];
        const abilityPool = [101, 102, 103, 201, 202, 301];

        return {
            actionType: getRandomElement(actionTypes),
            targetId: getRandomElement(validPlayerIds),
            abilityId: getRandomElement(abilityPool),
        };
    },
}