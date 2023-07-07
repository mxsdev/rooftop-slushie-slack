import { App, View } from '@slack/bolt'
import unfetch from 'isomorphic-unfetch'
import { getSecrets } from './secrets'

const bot = async () => {
    const secrets = await getSecrets()
    
    return new App({
        token: secrets['slack-bot-token'],
        signingSecret: secrets['slack-signing-secret'],
    })
}

const user = async () => {
    const secrets = await getSecrets()
    
    return new App({
        token: secrets['slack-user-token'],
        signingSecret: secrets['slack-signing-secret'],
    })
}

export async function sendMessage(text: string, channel: string, thread_ts?: string) {
    await (await bot()).client.chat.postMessage({
        // bot testing
        channel,

        // general
        // channel: 'C05BTJ2MHHS',
        text,

        thread_ts
    })
}

export async function openModal(trigger_id: string, view: View) {
    await (await bot()).client.views.open({
        trigger_id, view
    })
}

export interface StatusPayload {
    status_text: string,
    status_emoji?: string,
    status_expiration?: number
}

export async function setStatus(status: StatusPayload) {
    await (await user()).client.users.profile.set({
        profile: JSON.stringify({
            status_text: status.status_text,
            status_emoji: status.status_emoji,
            status_expiration: status.status_expiration ?? 0,
        })
    })
}

// async function main() {
//     // await app.client.users.profile.set({
//     //     profile: JSON.stringify({
//     //         status_text: "testing status update",
//     //         status_emoji: ":wrench:",
//     //         status_expiration: Date.now() + 100000,
//     //     })
//     // })
// }

export async function doOauthFlow (token: string) {
    const secrets = await getSecrets()
    
    const res = await (await bot()).client.oauth.v2.access({
        client_id: secrets['slack-client-id'],
        client_secret: secrets['slack-client-secret'],
        code: token,
    })

    return res
}

type ChatGPTMessage = {
    role: "user"|"system"|"assistant",
    content: string
}

export async function promptChatGPT(prompt: ChatGPTMessage[]) {
    const secrets = await getSecrets()

    const res = await unfetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Authorization": `Bearer ${secrets['openai-key']}`,
            "Content-Type": "application/json"
        },
        method: 'post',
        body: JSON.stringify({
            model: "gpt-4",
            // temperature: 2.0,
            max_tokens: 128,
            messages: prompt
        })
    })

    const json = await res.json()

    return json as {
        choices: {
            message: ChatGPTMessage,
            finish_reason: 'stop',
            index: number
        }[],
        created: number,
        id: string,
        model: string,
        object: string,
        usage: object,
    }
}