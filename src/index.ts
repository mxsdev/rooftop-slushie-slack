import express from 'express'
const app = express()
const port = process.env.PORT

import { NextApiRequest, NextApiResponse } from 'next'
import { MessageShortcut, GlobalShortcut, BlockAction, ViewSubmitAction, ViewClosedAction, View } from '@slack/bolt'
import { openModal, promptChatGPT, sendMessage, setStatus } from './util'
import { ACTION_ID_CHARACTER, ACTION_ID_DEST, BLOCK_ID_DEST, BLOCK_ID_SELECT_CHARACTER, CharacterModal, VALUE_DEST_CHANNEL_PING, VALUE_DEST_THREAD } from './util/views'
import { getSecrets } from './util/secrets'
import bodyParser from 'body-parser'
import { STATUS_ROTATION } from './status'
 
type InteractivityMessage = MessageShortcut | GlobalShortcut | BlockAction | ViewSubmitAction | ViewClosedAction

interface PrivateMetadata {
  message_text: string,
  message_id: string,
  channel: string,
  user_id: string,
}

app.use(bodyParser.urlencoded())
app.set('trust proxy', true)

app.get('/api/ping', async (req, res) => {
    res.status(200).json({
        message: req.body
    })
})

app.get('/api/status', async (req, res) => {
  const idx = (Math.floor(Date.now()/8.64e7) + 4) % STATUS_ROTATION.length
  await setStatus(STATUS_ROTATION[idx])

  res.status(200).json({ })
})

app.post('/api/interactivity', async (req, res) => {
  const payload = JSON.parse(req.body.payload) as InteractivityMessage

  switch (payload.type) {
    case 'message_action': {
      switch (payload.callback_id) {
        case 'respond': {
          const meta: PrivateMetadata = {
            message_id: payload.message.ts,
            channel: payload.channel.id,
            message_text: payload.message.text.toString(),
            user_id: payload.message.user,
          }
          
          openModal(payload.trigger_id, CharacterModal(JSON.stringify(meta)))
        } break
    
        default: {
          res.status(404).send({ message: `Unknown callback_id ${payload.callback_id}` })
          return
        }
      }
    } break

    case 'block_actions': { } break
    case 'view_closed': { } break

    case 'view_submission': {
      const character = payload.view.state.values[BLOCK_ID_SELECT_CHARACTER][ACTION_ID_CHARACTER].selected_option!.value

      const destOpts = payload.view.state.values[BLOCK_ID_DEST][ACTION_ID_DEST]

      console.log(JSON.stringify(destOpts, null, 2))

      const sendToThread = !!destOpts.selected_options!.find(x => x.value === VALUE_DEST_THREAD)
      const sendToChannelPing = !!destOpts.selected_options!.find(x => x.value === VALUE_DEST_CHANNEL_PING)

      const { channel, message_id, message_text, user_id } = JSON.parse(payload.view.private_metadata) as PrivateMetadata

      promptChatGPT([
        // {
        //   role: 'user',
        //   content: 'I received the following message:'
        // },
        {
          role: 'user',
          content: `"message_text"`
        },
        {
          role: 'user',
          content:`Write a convincing response to the previous message by the character ${character} from HBO's show 'Silicon Valley'. Write in short and casual style, like in a text message.`
        },
      ]).then((response) => {
        const responseText = response.choices.map(({ message: { content } }) => content).join("")

        if (sendToThread) {
          sendMessage(`${character} would respond by saying:\n\n${responseText}`, channel, message_id)
        }

        if (sendToChannelPing) {
          sendMessage(`<@${user_id}>\n\n${character} would respond by saying:\n\n${responseText}`, channel)
        }
      })

    } break
    
    default: {
      res.status(500).send({ message: 'Invalid interactivity type' })
      return
    } break
  }
  
  res.status(200).json({ })
})

const server = app.listen(port ?? 3000)

server.headersTimeout = 120 * 1000