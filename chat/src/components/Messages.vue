<script setup>
import { ref, computed, nextTick, defineProps, defineEmits } from "vue";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoSend } from "oh-vue-icons/icons";
// Register the icon
addIcons(CoSend);
const props = defineProps(["ourmessage", "currentid", "userid"]);
const emit = defineEmits(["send-message"]);
const newMessage = ref("");
const messageboxRef = ref(null);

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
    });
});

const sendMessage = () => {
  console.log(props.currentid, props.userid);
  if (newMessage.value.trim() === "") {
    alert("no message");
    return;
  }
  // Emit event to parent with new message
  emit("send-message", newMessage.value);
  newMessage.value = "";

  nextTick(() => {
    if (messageboxRef.value) {
      messageboxRef.value.scrollTop = messageboxRef.value.scrollHeight;
    }
  });
};
</script>

<template>
  <div class="message">
    <div class="messageblock" v-if="Object.keys(ourmessage).length > 0">
      <div class="messagebox" ref="messageboxRef">
        <div
          v-for="val of sortedmessage"
          :key="val[2]"
          :class="{
            leftmessage: val[0] !== userid,
            rightmessage: val[0] === userid,
          }"
        >
          {{ val[1] }}
        </div>
      </div>
      <div class="sendmessage">
        <div class="writemessage">
          <input type="text" v-model="newMessage" />
        </div>
        <OhVueIcon name="co-send" class="send-icon" @click="sendMessage" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message {
  width: 66%;
  height: 95%;
  border: 2px solid black;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.messageblock {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.messagebox {
  width: 97%;
  height: 85%;
  background-color: rgba(214, 198, 198, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.messagebox > :first-child {
  margin-top: auto !important;
  /* use !important to prevent breakage from child margin settings */
}
.messagebox::-webkit-scrollbar {
  width: 0;
}

.leftmessage,
.rightmessage {
  width: fit-content;
  padding: 10px 15px;
  max-width: 80%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.leftmessage {
  margin-left: 10px;
  align-self: flex-start;
  background-color: lightblue;
  padding: 8px;
  border-radius: 10px;
  max-width: 60%;
}

.rightmessage {
  margin-right: 10px;
  align-self: flex-end;
  background-color: lightgreen;
  padding: 8px;
  border-radius: 10px;
  max-width: 60%;
}

.sendmessage {
  width: 97%;
  height: 10%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: rgba(244, 239, 239, 0.5);
}

.send-icon {
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
}

.send-icon:hover {
  scale: 1.2;
  color: green;
}

.writemessage {
  width: 90%;
  height: 80%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.writemessage input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  border-radius: 8px;
  font-size: 25px;
  padding-left: 10px;
}
</style>
