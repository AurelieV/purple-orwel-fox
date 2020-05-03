<template>
  <div>
    <p>Hello world</p>
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        { src: 'https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js', hid: 'twitch-ext' },
      ],
    }
  },
}
</script>
