import { NextApiRequest, NextApiResponse } from 'next'
import { MessageShortcut, GlobalShortcut, BlockAction, ViewSubmitAction, ViewClosedAction, View } from '@slack/bolt'
import { openModal, promptChatGPT, sendMessage } from '../../util'
import { ACTION_ID_CHARACTER, BLOCK_ID_SELECT_CHARACTER, CharacterModal } from '../../util/views'
 
type InteractivityMessage = MessageShortcut | GlobalShortcut | BlockAction | ViewSubmitAction | ViewClosedAction

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const payload = JSON.parse(req.body.payload) as InteractivityMessage

  switch (payload.type) {
    case 'message_action': {
      switch (payload.callback_id) {
        case 'respond': {
          await openModal(payload.trigger_id, CharacterModal(payload.message.text.toString()))
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

      const message_text = payload.view.private_metadata

      const response = await promptChatGPT([
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
          content:`Write a convincing response from ${character} from 'Silicon Valley'`
        },
      ])

      const responseText = response.choices.map(({ message: { content } }) => content).join("")

      res.status(200).json({
        responseText
      })

      return
      
      // await sendMessage(`${character} would say: ${res.text}`)
    } break
    
    default: {
      res.status(500).send({ message: 'Invalid interactivity type' })
      return
    } break
  }
  
  res.status(200).json({ });
}