import { doOauthFlow } from "../util"

async function main() {
    const token = process.argv[2]

    const res = await doOauthFlow(token)

    console.log(res)

    console.log(JSON.stringify(res))
}

main()