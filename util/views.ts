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

export const CharacterModal: View = {
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
		}
	]
}