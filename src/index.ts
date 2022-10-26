import core from '@actions/core'
import { context, getOctokit } from "@actions/github";
import { Octokit } from "@octokit/core";

main()
    .catch(err => console.error(err))

async function main(): Promise<void> {
    const githubApiKey = core.getInput("github-token") || process.env.GITHUB_TOKEN
    const octokit = getOctokit(githubApiKey)

    console.log('running datadog service lookup')

    core.setOutput('team', 'unknown')
}
