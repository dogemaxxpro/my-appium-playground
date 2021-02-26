const AD_ACTIVITY = "AppLovinFullscreenActivity";
const MAIN_ACTIVITY = "MainActivity";
const LOGO_ACTIVITY = "LogoActivity";

const CLOSE_SELECTOR =
    'android=new UiSelector().className("android.widget.FrameLayout").index(1)';
const GO_SELECTOR =
    'android=new UiSelector().className("android.widget.Button").text("GO")';

const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;
jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

const WAIT_OPTIONS = { timeout: 30000, interval: 6000 };

const isCurrentActivity = async (driver, activityName, needPause) => {
    if (!Array.isArray(activityName)) {
        activityName = [activityName];
    }
    let currActivity = await driver.getCurrentActivity();
    let isActive = activityName.includes(
        currActivity.substring(currActivity.lastIndexOf(".") + 1)
    );
    if (needPause) {
        await driver.pause(800);
        currActivity = await driver.getCurrentActivity();
        isActive = activityName.includes(
            currActivity.substring(currActivity.lastIndexOf(".") + 1)
        );
    }
    return isActive;
};

const closeInterstitial = async () => {
    await driver.pause(1000);
    const isAdvert = await isCurrentActivity(driver, AD_ACTIVITY);

    if (isAdvert) {
        await driver.waitUntil(async () => {
            const results = await Promise.all([
                isCurrentActivity(driver, AD_ACTIVITY),
                (await $(CLOSE_SELECTOR)).isDisplayed(),
            ]);
            const result = results.reduce((a, b) => a && b, true);
            return result;
        }, WAIT_OPTIONS);
        (await $(CLOSE_SELECTOR)).click();
        return true;
    }
    return false;
};

class RouletteTest {
    static async clickGo() {
        await driver.waitUntil(
            async () => await (await $(GO_SELECTOR)).isDisplayed(),
            WAIT_OPTIONS
        );
        await (await $(GO_SELECTOR)).click();
        await driver.pause(300);

        if (driver.isAlertOpen && (await driver.isAlertOpen())) {
            await driver.acceptAlert();
            await (await $(GO_SELECTOR)).click();
        }
    }

    static async waitForAction() {
        let isActionable = false,
            counter = 0;

        while (!isActionable) {
            if (counter == 10) throw new Error("Waited for long...");
            isActionable = await isCurrentActivity(driver, [
                AD_ACTIVITY,
                MAIN_ACTIVITY,
            ]);
            counter++;
        }
        return isActionable;
    }

    static async executeScript() {
        await this.waitForAction();

        await closeInterstitial();
        await closeInterstitial();

        await driver.pause(300);
        await this.clickGo();
        await driver.pause(6000);

        await closeInterstitial();
        await closeInterstitial();
        await driver.pause(3000);
    }

    static async run() {
        try {
            await RouletteTest.executeScript();
        } catch (e) {
            console.error("Error occurred: ", e);
            return false;
        }
        return true;
    }
}

describe("Interacting with BFast BFree app", () => {
    it(
        "should be able to click GO, view ad and close it",
        async () => {
            const runAction = async () => {
                const isSuccess = await RouletteTest.run();
                setTimeout(runAction, 300);
                return isSuccess;
            };
            await new Promise((resolve, reject) => !runAction() && reject());
        },
        MAX_SAFE_TIMEOUT
    );
});
