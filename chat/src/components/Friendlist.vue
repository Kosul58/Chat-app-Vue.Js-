<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { GiHamburgerMenu } from "oh-vue-icons/icons";

// Register the icon
addIcons(GiHamburgerMenu);
// import { defineProps, defineEmits } from "vue";

const props = defineProps(["friends", "username", "userid", "userimg"]);
const emit = defineEmits(["friendclick", "logout", "update-friend"]);

const messageLoad = async (index) => {
  console.log(friendx.value[index]);
  emit("friendclick", friendx.value[index]); // parrent lai k load garni ho pathaudai
};

let friendx = ref(props.friends);

//hamburger controls start here
let y = ref(true);

const showburger = () => {
  if (y.value === true) {
    y.value = false;
  } else {
    y.value = true;
  }
};
const x = ref(window.innerWidth < 1100);
const checkWidth = () => {
  x.value = window.innerWidth < 1100;
};

// Add event listener to update `x` when window resizes
onMounted(() => {
  window.addEventListener("resize", checkWidth);
});

// Remove event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener("resize", checkWidth);
});

//hamburger control ends here

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
    console.log(friendx.value);
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
    console.log(data);
    if (data === "already friends") {
      alert("Already Friends");
    } else {
      // console.log(data[0]);
      emit("update-friend", data[0]);
      friendx.value = data[0].message;
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
    class="w-2/7 h-[95%] rounded-xl flex flex-col items-center justify-start scrollbar-hide bg-blue-300/60 shadow-[0px_0px_10px_rgba(0,0,0,0.6)] gap-2"
    v-if="!x"
  >
    <div class="flex items-center justify-center gap-4 w-[100%] mt-1">
      <img :src="userimg" alt="Profile Image" class="w-20 h-20 rounded-full" />
      <h1 class="text-3xl py-1 font-mono">{{ props.username }}</h1>
    </div>

    <div
      class="w-full h-7/9 flex flex-col items-center justify-start overflow-y-auto scrollbar-hide"
    >
      <form
        class="mt-2 w-11/12 h-12 bg-green-300/80 rounded-xl flex items-center justify-center gap-2 min-h-[50px]"
        @submit.prevent="searchuser"
      >
        <input
          type="text"
          v-model="searchinput"
          class="w-4/6 h-4/5 rounded-lg border-none outline-none text-lg px-2 bg-white"
        />
        <button
          type="submit"
          class="w-1/5 h-4/5 text-lg flex items-center justify-center rounded-md bg-white hover:bg-green-300 hover:scale-110 cursor-pointer"
        >
          Search
        </button>
      </form>
      <div
        v-if="searchcontrol"
        class="bg-green-200/80 w-11/12 min-h-fit mt-2 rounded-md flex flex-col items-center"
      >
        <div class="w-full h-5 flex justify-end">
          <div
            class="w-4 h-4 bg-red-500 rounded-full cursor-pointer hover:scale-110 mr-1 mt-1"
            @click="closesearchresult()"
          ></div>
        </div>
        <div
          v-for="(result, index) of searchresult"
          :key="result._id"
          class="w-11/12 h-[100px] bg-white/80 my-1 flex items-center justify-center gap-5 rounded-md"
        >
          <img
            :src="result.image"
            alt="Profile Image"
            class="w-20 h-20 object-contain rounded-full"
          />
          <h1 class="text-black text-2xl">{{ result.name }}</h1>
          <button
            @click="addfriend(index)"
            class="hover:bg-green-300 cursor-pointer px-3 py-1 rounded-md bg-amber-200 w-20 h-10 text-2xl font-serif"
          >
            Add
          </button>
        </div>
      </div>

      <div
        v-for="(friend, index) in friendx"
        :key="friend.id"
        class="my-2 w-11/12 min-h-20 rounded-lg text-white bg-gray-300/80 flex items-center justify-center text-2xl cursor-pointer"
        @click="messageLoad(index)"
      >
        <img :src="friend.image" :alt="index" class="w-16 h-16 rounded-full" />
        {{ friend.name }}
      </div>
    </div>

    <button
      @click="logout()"
      class="w-24 h-10 border-none cursor-pointer rounded-md bg-white hover:bg-red-500 hover:scale-110 mb-2"
    >
      Log Out
    </button>
  </div>
  <div
    v-if="x"
    class="w-[70%] h-[80%] absolute left-[3%] top-[3%] flex items-center justify-center"
  >
    <OhVueIcon
      name="gi-hamburger-menu"
      class="w-12 h-12 text-amber-50 cursor-pointer hover:scale-120 absolute top-1.5 left-1.5"
      v-if="y"
      @click="showburger"
    />
    <div
      v-if="!y"
      class="w-[90%] h-[95%] bg-blue-500 rounded-2xl flex items-center justify-center flex-col"
    >
      <div
        class="absolute top-[4%] right-[8%] w-5 h-5 rounded-2xl bg-amber-950 cursor-pointer hover:bg-red-800 hover:scale-110"
        @click="showburger"
      ></div>
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
          class="my-2 w-3/4 min-h-10 rounded-lg text-white bg-gray-300/80 flex items-center justify-center text-2xl cursor-pointer"
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
  </div>
</template>
