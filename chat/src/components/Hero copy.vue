<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoSend } from "oh-vue-icons/icons";
import LoginRegister from "./LoginRegister.vue";
import Messages from "./Messages.vue";
// Register the icon
addIcons(CoSend);
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
let loginmatch = ref(true);

//to store retrieved messages between users
let ourmessage = reactive({});
//to store data of current id
let currentid = ref({});

const messageboxRef = ref(null); // Add ref for the message box
const sortedmessage = computed(() => {
  if (!currentid.value.message) return [];

  const sortedArray = Object.entries(currentid.value.message)
    .flatMap(([id, messages]) =>
      messages.map(([message, timestamp]) => [id, message, timestamp])
    )
    .sort((a, b) => {
      const dateA = new Date(a[2].replace(/-(\d{2}):/, "T$1:"));
      const dateB = new Date(b[2].replace(/-(\d{2}):/, "T$1:"));
      return dateA - dateB;
    });

  return sortedArray;
});

const messageLoad = (index) => {
  currentid.value = friends[index];
  ourmessage.value = friends[index].message;
};

function sendMessage() {
  // Add a new message
  ourmessage.value[100].push(["this this", "2025-02-13-12:10:15"]);

  // Scroll to the bottom after the message is added
  nextTick(() => {
    if (messageboxRef.value) {
      messageboxRef.value.scrollTop = messageboxRef.value.scrollHeight;
    }
  });
  console.log(ourmessage.value);
}

const logout = () => {
  loginmatch.value = false;
};
</script>

<template>
  <LoginRegister :loginmatch="loginmatch" @update-login="loginmatch = $event" />
  <div class="chat-main" v-if="loginmatch">
    <div class="friendlist">
      <div class="friend-section">
        <div class="searchbar">
          <input type="text" />
          <button>Search</button>
        </div>
        <div
          v-for="(friend, index) of friends"
          class="friend"
          @click="messageLoad(index)"
        >
          {{ friend.id }} {{ friend.name }} {{ index }}
        </div>
      </div>
      <button @click="logout()">Log Out</button>
    </div>
    <div class="message">
      <div class="messageblock" v-if="Object.keys(ourmessage).length > 0">
        <div class="messagebox" ref="messageboxRef">
          <div
            v-for="val of sortedmessage"
            :key="val[2]"
            :class="{
              leftmessage: val[0] === String(currentid.id),
              rightmessage: val[0] === '100',
            }"
          >
            {{ val[1] }}
          </div>
        </div>
        <div class="sendmessage">
          <div class="writemessage">
            <input type="text" />
          </div>
          <OhVueIcon name="co-send" class="send-icon" @click="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.friendlist {
  width: 30%;
  height: 90%;
  border: 2px solid white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
}

.friendlist button {
  width: 100px;
  height: 40px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.friendlist button:hover {
  scale: 1.2;
  background-color: red;
}

.friend-section {
  width: 100%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  overflow-y: scroll;
}

.friend-section::-webkit-scrollbar {
  width: 0;
}

.friend {
  margin: 10px;
  width: 90%;
  min-height: 70px;
  border-radius: 8px;
  color: white;
  background-color: rgba(214, 198, 198, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
}
.searchbar {
  margin-top: 10px;
  width: 90%;
  min-height: 50px;
  background-color: rgba(214, 198, 198, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.searchbar input {
  width: 70%;
  height: 80%;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 22px;
  text-align: left;
  padding-left: 10px;
}

.searchbar input:focus {
  border: none;
  outline: none;
}

.searchbar button {
  border: none;
  width: 20%;
  height: 80%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.searchbar button:hover {
  background-color: greenyellow;
}

.message {
  width: 65%;
  height: 90%;
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
}

.leftmessage {
  margin-left: 10px;
  align-self: flex-start; /* Aligns to the left */
  background-color: lightblue;
  padding: 8px;
  border-radius: 10px;
  max-width: 60%;
}

.rightmessage {
  margin-right: 10px;
  align-self: flex-end; /* Aligns to the right */
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
