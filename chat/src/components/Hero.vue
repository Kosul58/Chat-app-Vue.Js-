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

//to store data of current id of friends
let currentid = ref({});

//to store username
let username = ref("");
//to store userid
let userid = ref("");

//to load messeges
const messageLoad = (friend) => {
  currentid.value = friend;
  ourmessage.value = { ...friend.message };
};

// const logout = () => {
//   loginmatch.value = false;
// };

const updatefriend = (data) => {
  friends.length = 0;
  for (let i = 0; i < data.message.length; i++) {
    friends.push(data.message[i]);
  }
  username.value = data.name;
  userid.value = data._id;
};

const handleSendMessage = (message) => {
  console.log(message);
  console.log(userid.value);
  console.log(currentid.value.id);
  const id = userid.value;
  if (!ourmessage.value[id]) {
    ourmessage.value[id] = [];
  }
  ourmessage.value[id].push([message, new Date().toISOString()]);
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
      :username="username"
      :userid="userid"
      :friends="friends"
      @friendclick="messageLoad"
      @logout="logout"
      @update-friend="updatefriend"
    />
    <Messages
      :ourmessage="ourmessage"
      :currentid="currentid"
      :userid="userid"
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
