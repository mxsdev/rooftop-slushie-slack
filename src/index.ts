import express from 'express'
const app = express()
const port = process.env.PORT

import { NextApiRequest, NextApiResponse } from 'next'
import { MessageShortcut, GlobalShortcut, BlockAction, ViewSubmitAction, ViewClosedAction, View } from '@slack/bolt'
import { openModal, promptChatGPT, sendMessage, setStatus } from './util'
import { ACTION_ID_CHARACTER, BLOCK_ID_SELECT_CHARACTER, CharacterModal } from './util/views'
import { getSecrets } from './util/secrets'
import bodyParser from 'body-parser'
import { STATUS_ROTATION } from './status'
 
type InteractivityMessage = MessageShortcut | GlobalShortcut | BlockAction | ViewSubmitAction | ViewClosedAction

interface PrivateMetadata {
  message_text: string,
  message_id: string,
  channel: string,
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

      const { channel, message_id, message_text } = JSON.parse(payload.view.private_metadata) as PrivateMetadata

      promptChatGPT([
        {
          role: 'user',
          content: 'I received the following message:'
        },
        {
          role: 'user',
          content: message_text
        },
        {
          role: 'user',
          content:`Write a convincing response by the character ${character} from HBO's show 'Silicon Valley'`
        },
      ]).then((response) => {
        const responseText = response.choices.map(({ message: { content } }) => content).join("")
        sendMessage(`${character} would respond by saying:\n\n${responseText}`, channel, message_id)
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