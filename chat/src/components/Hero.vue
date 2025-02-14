<script setup>
import { ref, reactive, computed, nextTick } from "vue";

import LoginRegister from "./LoginRegister.vue";
import Messages from "./Messages.vue";
import FriendList from "./Friendlist.vue";
// Register the icon
const friends = reactive([]);

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

const updatefriend = (data) => {
  for (let i = 0; i < data.message.length; i++) {
    friends.push(data.message[i]);
  }
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
  <LoginRegister
    :loginmatch="loginmatch"
    @update-login="loginmatch = $event"
    @update-friend="updatefriend"
  />
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
