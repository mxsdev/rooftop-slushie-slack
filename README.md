```sh
npx ts-node ./index.ts
```

```sh
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{payload: "{\"type\": \"view_submission\", \"view\": { \"private_metadata\": \"hello world\", \"state\": { \"values\": {\"select_character\": {\"character\": {\"selected_option\": {\"value\": \"Gilfoyle\"}}}}}}}"}' \
  localhost:3000/api/interactivity

#   --data '{"type": "message_action", "callback_id": "respond", "trigger_id": "test trigger id"}' \
```

```sh
npx ts-node ./test/testApi.ts
```

```sh
npx ts-node ./test/testApi.ts
```
