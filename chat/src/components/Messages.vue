<script setup>
import { ref, computed, nextTick, defineExpose } from "vue";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoSend } from "oh-vue-icons/icons";
import Emoji from "./Emoji.vue";
import { BiEmojiSmileFill } from "oh-vue-icons/icons";

// Register the icon
addIcons(CoSend);
addIcons(BiEmojiSmileFill);
const props = defineProps(["ourmessage", "currentid", "userid"]);
const emit = defineEmits(["send-message"]);

//sathi lai k message send garna lako tesko value lina
const newMessage = ref("");

const messageboxRef = ref(null);

function setEmojifromchild(data) {
  newMessage.value = newMessage.value + data;
}

//message haru lai time ra sender anusar sort garna
const sortedmessage = computed(() => {
  if (!props.currentid.message) return [];

  return Object.entries(props.currentid.message)
    .flatMap(([id, messages]) =>
      messages.map(([message, timestamp]) => [id, message, timestamp])
    )
    .sort((a, b) => {
      const dateA = new Date(a[2].replace(/-(\d{2}):/, "T$1:"));
      const dateB = new Date(b[2].replace(/-(\d{2}):/, "T$1:"));
      return dateA - dateB;
    })
    .reverse();
});

//sathi lai message pathauna
const sendMessage = () => {
  try {
    console.log(props.currentid, props.userid);
    if (newMessage.value.trim() === "") {
      alert("no message");
      emojishower.value = false;
      return;
    }
    emojishower.value = false;
    // Emit event to parent with new message
    emit("send-message", newMessage.value);
    newMessage.value = "";
    // console.log("aass");
    // console.log(messageboxRef.value);
  } catch {
  } finally {
    nextTick(() => {
      if (messageboxRef.value) {
        messageboxRef.value.scrollTop = messageboxRef.value.scrollHeight;
      }
    });
  }
};
let emojishower = ref(false);
function showEmoji() {
  emojishower.value = !emojishower.value;
}
</script>

<template>
  <div
    class="w-2/3 max-[1100px]:w-[85%] h-[95%] bg-red-400/85 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(10,10,10,0.7)]"
  >
    <div
      class="w-full h-full flex flex-col items-center justify-center gap-2"
      v-if="Object.keys(ourmessage).length > 0"
    >
      <div
        class="w-[97%] h-[85%] bg-amber-100/30 rounded-xl flex flex-col-reverse gap-2 overflow-y-scroll scrollbar-hide"
        ref="messageboxRef"
      >
        <div
          v-for="val of sortedmessage"
          :key="val[2]"
          :class="
            val[0] === userid
              ? 'self-end bg-green-300 p-3 px-4 rounded-lg max-w-[70%] min-w-[60px] mr-2 m-1.5 rounded-br-[20px]'
              : 'self-start bg-blue-300 p-3 px-4 rounded-lg max-w-[60%] min-w-[60px] ml-2 m-1.5 rounded-bl-[20px] '
          "
        >
          {{ val[1] }}
        </div>
      </div>
      <div
        class="w-[97%] h-[10%] rounded-md flex items-center justify-evenly bg-gray-100/50"
      >
        <div class="w-11/12 h-4/5 rounded-md flex items-center">
          <input
            type="text"
            v-model="newMessage"
            class="w-full h-full border-none outline-none rounded-md text-xl px-2"
          />
        </div>
        <Emoji
          @childemoji="setEmojifromchild"
          v-if="emojishower"
          class="absolute bottom-[15%] right-[5%]"
        />
        <OhVueIcon
          name="bi-emoji-smile-fill"
          class="w-8 h-8 text-white cursor-pointer hover:scale-110 mr-2"
          @click="showEmoji"
        />
        <OhVueIcon
          name="co-send"
          class="w-12 h-12 text-white cursor-pointer hover:scale-125 hover:text-green-600 mr-2"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>
