<script setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from "vue";
import { io } from "socket.io-client";
import LoginRegister from "./LoginRegister.vue";
import Messages from "./Messages.vue";
import FriendList from "./Friendlist.vue";

// WebSocket connection
const socket = io("http://localhost:3000");

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
let dummyval1;
//to load messeges
const messageLoad = async (friend) => {
  if (friend == "x") {
    friend = dummyval1;
    currentid.value = friend;
    ourmessage.value = { ...friend.message };
  } else {
    currentid.value = friend;
    ourmessage.value = { ...friend.message };
  }
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
  socket.emit("user-online", userid.value);
};

//message lai database ma pathauna
const handleSendMessage = async (message) => {
  try {
    // console.log(message);
    const id = userid.value;
    const fid = currentid.value.id;

    if (!ourmessage.value[id]) {
      ourmessage.value[id] = [];
    }

    const timestamp = new Date().toISOString();
    // console.log(timestamp);

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
    if (data) {
      console.log("object");
      const sentmessage = [message, id, fid];
      socket.emit("send-message", sentmessage);
    } else {
      alert("communication failed");
    }
    // console.log(data);
  } catch (error) {
    console.log("error", error);
  }
};

//realtime communication ko lagi
socket.on("message", (message) => {
  const id = currentid.value.id;
  const timestamp = new Date().toISOString();
  // console.log(timestamp);
  // Push the new message locally
  ourmessage.value[id].push([message.message, timestamp]);
  // console.log(message.message);
});
</script>
<template>
  <LoginRegister
    :loginmatch="loginmatch"
    @update-login="loginmatch = $event"
    @update-friend="updatefriend"
  />

  <div
    v-if="loginmatch"
    class="w-[95vw] h-[95vh] bg-gray-400/50 rounded-2xl shadow-2xl flex items-center justify-around"
  >
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
