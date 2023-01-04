
import { Octokit } from 'octokit';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// getReposInfo();
// getReposMetrics();
// getReposReferrers();
// getReposTags();
// getReposTopics();
// getUserFollowers();
getUserDetails();

/*
export async function getReposInfo(): Promise<RestEndpointMethodTypes['repos']['get']['response']['data']> { 
    const { data } = await octokit.rest.repos.get({
        owner: process.env.USERNAME,
        repo: process.env.REPO
    });

    console.log(data);
    return data;
}

export async function getReposMetrics(): Promise<RestEndpointMethodTypes['repos']['getViews']['response']['data']> {
    const { data } = await octokit.rest.repos.getViews({
        owner: process.env.USERNAME,
        repo: process.env.REPO
    });

    console.log(data);
    return data;
}

export async function getReposTags(): Promise<RestEndpointMethodTypes['repos']['listTags']['response']['data']> {
    const { data } = await octokit.rest.repos.listTags({
        owner: process.env.USERNAME,
        repo: process.env.REPO
    });

    console.log(data);
    return data;
}

export async function getReposTopics(): Promise<RestEndpointMethodTypes['repos']['getAllTopics']['response']['data']> {
    const { data } = await octokit.rest.repos.getAllTopics({
        owner: process.env.USERNAME,
        repo: process.env.REPO
    });

    console.log(data);
    return data;
}

export async function getUserFollowers(): Promise<RestEndpointMethodTypes['users']['listFollowersForUser']['response']['data']> {
    const { data } = await octokit.rest.users.listFollowersForUser({
        username: process.env.USERNAME,
    });

    console.log(data);
    return data;
}

*/

export async function getUserDetails(): Promise<RestEndpointMethodTypes['users']['getByUsername']['response']['data']> {
    const { data } = await octokit.rest.users.getByUsername({
        username: process.env.USERNAME
    });

    console.log(data);
    return data;
}

