import { getInput, setOutput, exportVariable } from '@actions/core'
import { context, getOctokit } from "@actions/github";
import { Octokit } from "@octokit/core";

import yaml from 'yamljs'

main()
    .catch(err => console.error(err))

async function main(): Promise<void> {
    const githubApiKey = getInput("github-token") || process.env.GITHUB_TOKEN
    const repository = getInput('repository') || process.env.GITHUB_REPOSITORY
    const path = getInput('path') || 'service.datadog.yaml'

    const octokit = getOctokit(githubApiKey)
    
    console.log(`looking up datadog service definition "${path}" at repository "${repository}"`)

    const file = await getFile(octokit, repository, path, context.ref || undefined)
    const datadog = {
        service: '',
        team: '',
        module: '',
        tags: [] as Array<string>
    }

    if(file) {
        const json = yaml.parse(file)
        if(json) {
            const tags = Object.fromEntries(Array
                .from(json['tags'] ?? [])
                .map(entry => typeof entry == 'string' ? entry.split(':') : [])
            )

            datadog.service = String(json['dd-service'])
            datadog.team = String(json['team'])
            datadog.module = String(tags['module'])

            datadog.tags = Object
                .entries(tags)
                .map(([key, value]) => `${key}:${value}`)
        }
    }

    setOutput('service', datadog.service)
    setOutput('team', datadog.team)
    setOutput('module', datadog.module)

    if(datadog.service) {
        exportVariable('DD_SERVICE', datadog.service)
        exportVariable('TFSO_DD_SERVICE', datadog.service)
    }
    
    if(datadog.tags.length > 0) {            
        exportVariable('DD_TAGS', datadog.tags.join(','))
        exportVariable('TFSO_DD_TAGS', datadog.tags.join(','))
    }
}

async function getFile(octokit: Octokit, repository: string, path: string, ref?: string) {
    const [, owner, repo] = /([^\/]+)\/(.*)/gi.exec(repository)
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { 
        owner,
        repo,
        path,
        ref
    })

    if(response.status == 200) {
        if(typeof response.data == 'object' && 'type' in response.data && response.data.type == 'file') {
            return Buffer.from(response.data.content, 'base64').toString()
        }
    }

    return null
}
