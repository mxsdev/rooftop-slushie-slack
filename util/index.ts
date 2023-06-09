import { App, View } from '@slack/bolt'

const bot = () => new App({
    token: process.env['SLACK_BOT_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET'],
})

const user = new App({
    token: process.env['SLACK_USER_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET'],
})

export async function sendMessage(message: string) {
    // console.log(process.env['SLACK_BOT_TOKEN'])
    
    await bot().client.chat.postMessage({
        // bot testing
        channel: 'C05C3Q4HCF3',

        // general
        // channel: 'C05BTJ2MHHS',
        text: message,
    })
}

export async function openModal(trigger_id: string, view: View) {
    await bot().client.views.open({
        trigger_id, view
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
    const res = await bot().client.oauth.v2.access({
        client_id: process.env['SLACK_CLIENT_ID']!,
        client_secret: process.env['SLACK_CLIENT_SECRET']!,
        code: token,
    })

    console.log(res)
}

type ChatGPTMessage = {
    role: "user"|"system"|"assistant",
    content: string
}

export async function promptChatGPT(prompt: ChatGPTMessage[]) {
    // const token = process.env['OPENAI_KEY']

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Authorization": `Bearer ${process.env['OPENAI_KEY']}`,
            "Content-Type": "application/json"
        },
        method: 'post',
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            temperature: 2.0,
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