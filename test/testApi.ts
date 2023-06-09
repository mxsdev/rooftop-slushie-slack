async function main() {
    const res = await fetch("http://localhost:3000/api/interactivity", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "post",
        body: JSON.stringify({
            payload: JSON.stringify({
                type: "view_submission",
                view: {
                    "private_metadata": "hello world",
                    state: {
                        values: {
                            select_character: {
                                character: {
                                    selected_option: {
                                        value: "Gilfoyle"
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