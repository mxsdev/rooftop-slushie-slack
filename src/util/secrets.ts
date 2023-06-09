import {SecretManagerServiceClient} from '@google-cloud/secret-manager'
const client = new SecretManagerServiceClient();

const appSecrets = [
    'slack-bot-token',
    'slack-user-token',
    'slack-signing-secret',
    'slack-client-id',
    'slack-client-secret',
    'openai-key',
] as const

type AppSecret = (typeof appSecrets)[number]

type AppSecrets = Record<AppSecret, string>

let secrets: AppSecrets|undefined

export async function getSecrets(): Promise<AppSecrets> {
    if (secrets) return secrets

    const res = Object.fromEntries(await Promise.all(appSecrets.map(async (sid) => {
        const [accessResponse] = await client.accessSecretVersion({
            name: `projects/rooftop-slushie-slack-dev/secrets/${sid}/versions/1`
        });

        const responsePayload = accessResponse.payload.data.toString()

        return [sid, responsePayload]
    })))

    secrets = res

    return res
}