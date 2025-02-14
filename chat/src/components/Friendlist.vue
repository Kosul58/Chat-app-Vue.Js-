<script setup>
// import { defineProps, defineEmits } from "vue";

const props = defineProps(["friends"]);
const emit = defineEmits(["friendclick"]);

const messageLoad = (index) => {
  emit("friendclick", props.friends[index]); // Emit event to parent with selected friend
};

const logout = () => {
  emit("logout"); // Emit logout event to parent
};
</script>

<template>
  <div class="friendlist">
    <div class="friend-section">
      <div class="searchbar">
        <input type="text" />
        <button>Search</button>
      </div>
      <div
        v-for="(friend, index) in friends"
        :key="friend.id"
        class="friend"
        @click="messageLoad(index)"
      >
        {{ friend.id }} {{ friend.name }}
      </div>
    </div>
    <button @click="logout()">Log Out</button>
  </div>
</template>

<style scoped>
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
</style>
