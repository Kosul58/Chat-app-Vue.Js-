<script setup>
import { ref, reactive, computed, nextTick } from "vue";

import LoginRegister from "./LoginRegister.vue";
import Messages from "./Messages.vue";
import FriendList from "./Friendlist.vue";
// Register the icon
const friends = reactive([
  {
    id: 101,
    name: "ram",
    message: {
      101: [
        ["yoyo", "2025-02-13-10:15:10"],
        ["tero", "2025-02-13-10:25:25"],
      ],
      100: [
        ["yaya", "2025-02-13-10:16:25"],
        ["mero", "2025-02-13-10:22:22"],
      ],
    },
  },
  { id: 102, name: "sita", message: { 102: ["kaka"], 100: ["kiki"] } },
  { id: 103, name: "rita" },
  { id: 104, name: "gita" },
  { id: 105, name: "hari" },
  { id: 106, name: "kosul" },
  { id: 107, name: "kushal" },
  { id: 108, name: "kopila" },
  { id: 109, name: "rahul" },
]);

//to hide or display user account
let loginmatch = ref(false);
//to store retrieved messages between users
let ourmessage = reactive({});
//to store data of current id
let currentid = ref({});

const messageLoad = (friend) => {
  currentid.value = friend;
  ourmessage.value = { ...friend.message }; // Ensure reactivity
};

const logout = () => {
  loginmatch.value = false;
};

const handleSendMessage = (message) => {
  if (!ourmessage.value[100]) {
    ourmessage.value[100] = [];
  }
  ourmessage.value[100].push([message, new Date().toISOString()]);

  console.log(ourmessage.value);
};
</script>

<template>
  <LoginRegister :loginmatch="loginmatch" @update-login="loginmatch = $event" />
  <div class="chat-main" v-if="loginmatch">
    <FriendList
      :friends="friends"
      @friendclick="messageLoad"
      @logout="logout"
    />
    <Messages
      :ourmessage="ourmessage"
      :currentid="currentid"
      @send-message="handleSendMessage"
    />
  </div>
</template>

<style>
.chat-main {
  width: 80dvw;
  height: 80dvh;
  background-color: rgba(214, 198, 198, 0.8);
  border-radius: 40px;
  box-shadow: 0px 0px 40px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
}
</style>
