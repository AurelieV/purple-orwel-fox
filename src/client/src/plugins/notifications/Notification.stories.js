import { action } from '@storybook/addon-actions'

import Notification from './Notification'

export default {
  title: 'Components/Utils/Notification',
  component: Notification,
}

function NotificationStory({
  type = 'info',
  message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}) {
  return () => ({
    components: { Notification },
    data() {
      return {
        notification: {
          type,
          id: 0,
          message,
        },
      }
    },
    methods: {
      close: action('Close'),
    },
    template: `
      <div style="display: flex; justify-content: space-around; padding-top: 30px;">
        <Notification :notification="notification" @close="close"></Notification>
      </div>
    `,
  })
}

export const Error = NotificationStory({ type: 'error' })

export const Info = NotificationStory({ type: 'info' })

export const Success = NotificationStory({ type: 'success' })
