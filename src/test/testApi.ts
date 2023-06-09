// const nodefetch = require('node-fetch')
// import unfetch from 'unfetch'
import unfetch from 'isomorphic-unfetch'

async function main() {
    await testStatus()
}

async function testStatus() {
    // const url = "https://rooftop-slushie-slack-dev.wl.r.appspot.com"
    const url = "http://localhost:3000"
    
    const res = await unfetch(`${url}/api/status`, {
        method: "get",
    })
    
    const json = await res.json()

    console.log(json)
}

async function testInteractivity() {
    // const url = "http://localhost:3000"
    const url = "https://rooftop-slushie-slack-dev.wl.r.appspot.com"
    
    const res = await unfetch(`${url}/api/interactivity`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "post",
        body: JSON.stringify({
            payload: JSON.stringify({
                type: "view_submission",
                view: {
                    "private_metadata": "Hey, can we get this PR merged by next monday? Thanks!",
                    state: {
                        values: {
                            select_character: {
                                character: {
                                    selected_option: {
                                        value: "Jian Yang"
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
    })
    
    const json = await res.json()

    console.log(json)
}

main()


// curl --header "Content-Type: application/json" \
//   --request POST \
//   --data '{payload: "{\"type\": \"view_submission\", \"view\": { \"private_metadata\": \"hello world\", \"state\": { \"values\": {\"select_character\": {\"character\": {\"selected_option\": {\"value\": \"Gilfoyle\"}}}}}}}"}' \
//   localhost:3000/api/interactivity