import { View } from '@slack/bolt'

const characterList = [
    "Erlich Bachman",
    "Gilfoyle",
    "Dinesh",
    "Richard Hendricks",
    "Laurie",
    "Peter Gregory",
    "Jared Dunn",
    "Gavin Belson",
    "Jian Yiang",
    "Russ Hanneman",
    "Big Head",
    "Jack Barker",
]

export const BLOCK_ID_SELECT_CHARACTER = "select_character" as const
export const ACTION_ID_CHARACTER = "character" as const

export const BLOCK_ID_DEST = "destination" as const
export const ACTION_ID_DEST = "destination" as const
export const VALUE_DEST_THREAD = "thread" as const
export const VALUE_DEST_CHANNEL_PING = "channel_ping" as const

export const CharacterModal = (private_metadata?: string): View => ({
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "My App",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	private_metadata,
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Select a character to respond"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select",
					"emoji": true
				},
                "options": characterList.map(name => ({
                    text: {
                        type: "plain_text",
                        text: name,
                        emoji: true
                    },
                    value: name,
                })),
				"action_id": ACTION_ID_CHARACTER
			},
			"block_id": BLOCK_ID_SELECT_CHARACTER
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Options*"
			},
			"accessory": {
				"type": "checkboxes",
				"options": [
					{
						"text": {
							"type": "mrkdwn",
							"text": "Reply in Thread"
						},
						"value": VALUE_DEST_THREAD
					},
					{
						"text": {
							"type": "mrkdwn",
							"text": "Reply in Channel"
						},
						"value": VALUE_DEST_CHANNEL_PING
					}
				],
				"action_id": ACTION_ID_DEST
			},
			"block_id": BLOCK_ID_DEST
		}
	]
})