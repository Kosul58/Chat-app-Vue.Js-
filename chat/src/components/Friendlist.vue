<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
// import { defineProps, defineEmits } from "vue";

const props = defineProps(["friends", "username", "userid"]);
const emit = defineEmits(["friendclick", "logout", "update-friend"]);

const messageLoad = async (index) => {
  emit("friendclick", props.friends[index]); // parrent lai k load garni ho pathaudai
};

//search gareko result store gardai
let searchresult = ref("");
//search content dekhauni ki nai control
let searchcontrol = ref(false);

//searchresult lai close garna
const closesearchresult = () => {
  searchcontrol.value = false;
};

//logout garna
const logout = () => {
  emit("logout");
};

//k search garni ho  tesko value lina
const searchinput = ref("");

//database ma user search garna
const searchuser = async () => {
  try {
    if (props.username === searchinput.value) {
      alert("Cannot search self");
      searchresult.value = 0;
      searchcontrol.value = false;
      return;
    }
    const response = await fetch("http://localhost:3000/searchuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: searchinput.value }),
    });
    const data = await response.json();
    // console.log(data.length);
    if (data.length >= 1) {
      searchresult.value = data;
      // console.log(searchresult.value[0].name);
      searchcontrol.value = true;
    } else {
      alert("No user found");
      searchresult.value = 0;
      searchcontrol.value = false;
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

//database ma bhako user lai add garna
const addfriend = async (index) => {
  try {
    const myid = props.userid;
    const friendid = searchresult.value[index]._id;
    // console.log(myid, friendid);
    const response = await fetch("http://localhost:3000/addfriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ myid, friendid }),
    });
    const data = await response.json();
    if (data === "already friends") {
      alert("Already Friends");
    } else {
      console.log(data[0]);
      emit("update-friend", data[0]);
      setTimeout(() => {
        messageLoad("x");
      }, 1000);
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    nextTick();
  }
};
</script>

<template>
  <div class="friendlist">
    <h1>{{ props.username }}</h1>
    <div class="friend-section">
      <form class="searchbar" @submit.prevent="searchuser">
        <input type="text" v-model="searchinput" />
        <button type="submit">Search</button>
      </form>
      <div class="searchresults" v-if="searchcontrol">
        <div class="closeiconcontainer">
          <div class="closeicon" @click="closesearchresult()"></div>
        </div>
        <div
          v-for="(result, index) of searchresult"
          :key="result._id"
          class="searchresult"
        >
          <h1>{{ result.name }}</h1>
          <button @click="addfriend(index)">Add</button>
        </div>
      </div>

      <div
        v-for="(friend, index) in friends"
        :key="friend.id"
        class="friend"
        @click="messageLoad(index)"
      >
        {{ friend.name }}
      </div>
    </div>
    <button @click="logout()">Log Out</button>
  </div>
</template>

<style scoped>
.friendlist {
  width: 30%;
  height: 95%;
  border: 2px solid white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  overflow-y: auto;
}

.friendlist::-webkit-scrollbar {
  width: 0;
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
  height: 80%;
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
  max-height: 50px;
  background-color: rgba(214, 198, 198, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: row;
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
  scale: 1.1;
}

.friendlist h1 {
  color: whitesmoke;
  font-size: 25px;
}

.searchresults {
  background-color: rgba(247, 241, 241, 0.8);
  width: 90%;
  min-height: fit-content;
  margin-top: 10px;
  border-radius: 8px;
  /* height: fit-content; */
  z-index: 5;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.closeiconcontainer {
  width: 100%;
  height: 20px;
  margin-top: 1px;
  display: flex;
  justify-content: end;
}

.closeicon {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgb(252, 5, 5);
  cursor: pointer;
}
.closeicon:hover {
  scale: 1.2;
}
.searchresult {
  width: 90%;
  height: 50px;
  background-color: rgba(255, 254, 254, 0.8);
  z-index: 8;
  margin: 5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 20px;
}
.searchresult h1 {
  color: black;
  size: 5px;
  width: fit-content;
}

.searchresult button:hover {
  background-color: greenyellow;
  cursor: pointer;
  scale: 1;
}
</style>
