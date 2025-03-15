<script setup>
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
const emit = defineEmits(["childemoji"]);
// event callback
function onSelectEmoji(emoji) {
  emit("childemoji", emoji.i);
}
</script>
<template>
  <EmojiPicker :native="true" @select="onSelectEmoji" />
</template>
