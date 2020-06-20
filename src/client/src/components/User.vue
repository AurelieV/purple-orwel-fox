<template>
  <div class="user">
    <button @click="$emit('toggleActive')" class="user__active-button">
      <img class="user__profile-img" :src="user.profile_image_url" />
      <div class="user__login">{{ user.display_name }}</div>
    </button>
    <button v-if="isAdmin" @click="$emit('delete')" class="btn -outlined -secondary">
      Supprimer
    </button>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
    isAdmin: { type: Boolean, default: true },
  },
}
</script>

<style lang="scss">
.user {
  display: flex;
  align-items: center;
  padding: $spacing-5;
  width: 100%;
  &__profile-img {
    width: $spacing-6;
    margin-right: $spacing-1;
  }
  &__active-button {
    display: flex;
    align-items: center;
    flex: 1;
  }
}
</style>
