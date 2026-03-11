export const content = {
    // Name used in the Matrix intro
    name: "Shakira",

    // WhatsApp number to receive messages (country code + number, no + or spaces)
    whatsappNumber: "6288987295210",

    // Intro text shown on Matrix scene  
    introTitle: "FOR YOU",

    // Romantic reveal heading
    revealMessage: "I have something I've been meaning to tell you...",

    // Love message
    loveMessage: "From the very first time we talked,\nsomething inside me just clicked.\nYou make my ordinary days feel like magic.\nI wanna be the reason\nyou smile every single day.",

    // Closing message for the heart formation
    closingMessage: "I Love You ❤️",

    // Photos used in the Gallery and Stack scenes
    photos: [
        "/photos/IMG-20260130-WA0000.jpg",
        "/photos/IMG-20260209-WA0000.jpg",
        "/photos/IMG-20260212-WA0011.jpg",
        "/photos/IMG-20260212-WA0012.jpg",
        "/photos/IMG_20260304_152458_024.jpg",
        "/photos/IMG_20260306_212125_534.jpg",
        "/photos/IMG_20260310_234454_289.jpg",
        "/photos/IMG_20260310_234454_618.jpg",
        "/photos/PXL_20260311_092813756.RAW-01.MP.COVER.jpg",
        "/photos/c46471b5-143a-419c-893e-9887323793ce-copied-media~2.png"
    ],

    // Captions for each photo in the gallery
    photoCaptions: [
        "Every moment with you feels like a dream ✨",
        "I always wanna be by your side 💫",
        "You're the reason behind my smile 💖"
    ],

    // Background music (Bryan Adams - Heaven)
    music: "/music/heaven.m4a",

    // Scene Durations (in milliseconds)
    timing: {
        scene0: 5000, // Matrix Intro
        scene1: 4000, // Romantic Reveal
        scene2: 7000, // Photo Gallery (longer for carousel)
        scene3: 4000, // Love Message
        // Scene 4 (Photo Stack heart) stays forever
    }
};
