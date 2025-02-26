<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
// import { defineProps, defineEmits } from "vue";

const props = defineProps(["friends", "username", "userid"]);
const emit = defineEmits(["friendclick", "logout", "update-friend"]);

const messageLoad = async (index) => {
  emit("friendclick", props.friends[index]); // parrent lai k load garni ho pathaudai
};

//search gareko result store gardai euta value ma
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
  <div
    class="w-1/3 h-[95%] border-2 border-white rounded-xl flex flex-col items-center justify-evenly overflow-y-auto scrollbar-hide"
  >
    <h1 class="text-whitesmoke text-2xl">{{ props.username }}</h1>
    <div
      class="w-full h-4/5 flex flex-col items-center justify-start overflow-y-auto scrollbar-hide"
    >
      <form
        class="mt-2 w-11/12 h-12 bg-gray-300/80 rounded-xl flex items-center justify-center gap-2"
        @submit.prevent="searchuser"
      >
        <input
          type="text"
          v-model="searchinput"
          class="w-4/6 h-4/5 rounded-lg border-none outline-none text-lg px-2 bg-white"
        />
        <button
          type="submit"
          class="w-1/5 h-4/5 text-lg flex items-center justify-center rounded-md bg-white hover:bg-green-300 hover:scale-110"
        >
          Search
        </button>
      </form>

      <div
        v-if="searchcontrol"
        class="bg-gray-200/80 w-11/12 min-h-fit mt-2 rounded-md flex flex-col items-center"
      >
        <div class="w-full h-5 flex justify-end">
          <div
            class="w-4 h-4 bg-red-500 rounded-full cursor-pointer hover:scale-110"
            @click="closesearchresult()"
          ></div>
        </div>
        <div
          v-for="(result, index) of searchresult"
          :key="result._id"
          class="w-11/12 h-12 bg-white/80 my-1 flex items-center justify-center gap-5 rounded-md"
        >
          <h1 class="text-black text-lg">{{ result.name }}</h1>
          <button
            @click="addfriend(index)"
            class="hover:bg-green-300 cursor-pointer px-3 py-1 rounded-md bg-amber-200"
          >
            Add
          </button>
        </div>
      </div>

      <div
        v-for="(friend, index) in friends"
        :key="friend.id"
        class="my-2 w-11/12 min-h-16 rounded-lg text-white bg-gray-300/80 flex items-center justify-center text-2xl cursor-pointer"
        @click="messageLoad(index)"
      >
        {{ friend.name }}
      </div>
    </div>

    <button
      @click="logout()"
      class="w-24 h-10 border-none cursor-pointer rounded-md bg-white hover:bg-red-500 hover:scale-110"
    >
      Log Out
    </button>
  </div>
</template>
