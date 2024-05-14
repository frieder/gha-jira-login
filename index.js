const core = require("@actions/core");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const fs = require("fs");
const os = require("os");
const path = require("path");
const yaml = require("yaml");

(async function () {
    const args = parseInputs();
    const client = createHttpClient(args);
    await client.get("/rest/api/3/myself");
    writeCredentialsToDisk(args);
})().catch((error) => {
    core.setFailed("An unexpected error occurred, check output");
    core.error(error);
});

function parseInputs() {
    const baseUrl = core.getInput("baseUrl") || process.env.JIRA_BASE_URL;
    const email = core.getInput("email") || process.env.JIRA_USER_EMAIL;
    const token = core.getInput("token") || process.env.JIRA_API_TOKEN;

    if (!baseUrl) {
        throw new Error("Base URL is required");
    }
    if (!email) {
        throw new Error("User email is required");
    }
    if (!token) {
        throw new Error("Access token is required");
    }

    return {
        baseUrl,
        email,
        token,
    };
}

function createHttpClient(args) {
    const httpc = axios.create({
        baseURL: args.baseUrl,
        auth: {
            username: args.email,
            password: args.token,
        },
        timeout: 10000,
    });

    const retryCondition = (error) => {
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            ![200].includes(error.response.status)
        );
    };

    axiosRetry(httpc, {
        retries: 1,
        retryCondition: retryCondition,
        retryDelay: () => 10000,
        shouldResetTimeout: true,
        onRetry: (number, error) => {
            core.info(`Request failed with [${error.response?.status}], try again in 10s`);
        },
    });

    return httpc;
}

function writeCredentialsToDisk(args) {
    const jiraDir = path.join(os.homedir(), "jira");
    const configFile = path.join(jiraDir, "config.yml");

    if (!fs.existsSync(jiraDir)) {
        fs.mkdirSync(jiraDir);
    }

    const data = {
        baseUrl: args.baseUrl,
        email: args.email,
        token: args.token,
    };

    fs.writeFileSync(configFile, yaml.stringify(data));
}
