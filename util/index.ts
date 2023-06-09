import { App, View } from '@slack/bolt'
import assert from 'node:assert'

const bot = new App({
    token: process.env['SLACK_BOT_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET'],
})

const user = new App({
    token: process.env['SLACK_USER_TOKEN'],
    signingSecret: process.env['SLACK_SIGNING_SECRET'],
})

export async function sendMessage(message: string) {
    // console.log(process.env['SLACK_BOT_TOKEN'])
    
    await bot.client.chat.postMessage({
        // bot testing
        channel: 'C05C3Q4HCF3',

        // general
        // channel: 'C05BTJ2MHHS',
        text: message,
    })
}

export async function openModal(trigger_id: string, view: View) {
    await bot.client.views.open({
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
    const res = await bot.client.oauth.v2.access({
        client_id: process.env['SLACK_CLIENT_ID']!,
        client_secret: process.env['SLACK_CLIENT_SECRET']!,
        code: token,
    })

    console.log(res)
}