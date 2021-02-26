const { join } = require("path");
const { config } = require("./wdio.shared.conf");

// ============
// Specs
// ============
config.specs = ["./tests/specs/**/app.roulette.spec.js"];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // The defaults you need to have in your config
        platformName: "Android",
        maxInstances: 1,
        // For W3C the appium capabilities need to have an extension prefix
        // http://appium.io/docs/en/writing-running-appium/caps/
        // This is `appium:` for all Appium Capabilities which can be found here
        "appium:deviceName": "Samsung_A10",
        "appium:platformVersion": "9.0",
        "appium:orientation": "PORTRAIT",

        // `automationName` will be mandatory, see
        // https://github.com/appium/appium/releases/tag/v1.13.0
        "appium:automationName": "UiAutomator2",
        // The path to the app
        "appium:app": join(process.cwd(), "./apps/com.bfast.bfree.apk"),
        "appium:appPackage": "com.bfast.bfree",
        "appium:appActivity": "bfast.bfree.Activities.MainActivity",
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        "appium:noReset": true,
        "appium:newCommandTimeout": 240,
        "appium:autoGrantPermissions": true,
    },
];

exports.config = config;
