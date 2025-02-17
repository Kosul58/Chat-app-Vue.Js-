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

//to load messeges
const messageLoad = (friend) => {
  console.log(friend);
  currentid.value = friend;
  ourmessage.value = { ...friend.message };
};

//to logout
const logout = () => {
  loginmatch.value = false;
};

//friend update garna on friend add garda or delete garda
const updatefriend = (data) => {
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
    const x = new Date().toISOString();
    console.log(x);
    ourmessage.value[id].push([message, new Date().toISOString()]);

    //aba database ma data patham
    const response = await fetch("http://localhost:3000/sendmymessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: message, uid: id, fid: fid }),
    });
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    friends = [...data.message]; // Reassign array (fully reactive)
  } catch (error) {
    console.log("error", error);
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
      :friends="friends"
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
