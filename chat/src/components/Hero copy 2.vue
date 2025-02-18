<script setup>
import { ref, reactive, computed, nextTick } from "vue";

import LoginRegister from "./LoginRegister.vue";
import Messages from "./Messages.vue";
import FriendList from "./Friendlist.vue";
// Register the icon
let friends = reactive([]);

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

let xzx;
//to load messeges
const messageLoad = async (friend) => {
  currentid.value = friend;
  ourmessage.value = { ...friend.message };
};

//to logout
const logout = () => {
  loginmatch.value = false;
};

//friend update garna on friend add garda or delete garda
const updatefriend = async (data) => {
  friends = [...data.message];
  username.value = data.name;
  userid.value = data._id;
};

//message lai database ma pathauna
const handleSendMessage = async (message) => {
  try {
    console.log(message);
    const id = userid.value;
    const fid = currentid.value.id;

    if (!ourmessage.value[id]) {
      ourmessage.value[id] = [];
    }

    const timestamp = new Date().toISOString();
    console.log(timestamp);

    // Push the new message locally
    ourmessage.value[id].push([message, timestamp]);

    // Send message to the database
    const response = await fetch("http://localhost:3000/sendmymessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: message, uid: id, fid: fid }),
    });

    if (!response.ok) {
      throw new Error(`Message send failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("error", error);
  } finally {
    // ✅ Force Vue to re-render the component
    nextTick(() => {
      console.log("Re-rendering FriendList and messages...");
    });
  }
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
  width: 95dvw;
  height: 95dvh;
  background-color: rgba(214, 198, 198, 0.8);
  border-radius: 18px;
  box-shadow: 0px 0px 40px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
}
</style>
