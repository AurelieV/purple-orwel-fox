<template>
  <div class="user">
    <button @click="$emit('toggleActive')" class="user__active-button">
      <img class="user__profile-img" :src="user.profile_image_url" />
      <div class="user__login">{{ user.display_name }}</div>
    </button>
    <button @click="$emit('delete')" class="btn -outlined -secondary">Supprimer</button>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
  },
}
</script>

<style lang="scss">
.user {
  display: flex;
  align-items: center;
  padding: $m-space;
  width: 100%;
  &__profile-img {
    width: $small-image-size;
    margin-right: $xs-space;
  }
  &__active-button {
    display: flex;
    align-items: center;
    flex: 1;
  }
}
</style>
