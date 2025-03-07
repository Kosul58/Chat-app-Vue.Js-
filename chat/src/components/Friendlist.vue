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
import { MdAddcircle } from "oh-vue-icons/icons";
// Register the icon
addIcons(GiHamburgerMenu);
addIcons(MdAddcircle);
// import { defineProps, defineEmits } from "vue";

const props = defineProps(["friends", "username", "userid", "userimg"]);
const emit = defineEmits(["friendclick", "logout", "update-friend"]);

const messageLoad = async (index) => {
  console.log(friendx.value[index]);
  emit("friendclick", friendx.value[index]); // parrent lai k load garni ho pathaudai
};

let friendx = ref(props.friends);

// Watch for changes in props.friends
watch(
  () => props.friends,
  (newFriends) => {
    // Update friendx whenever props.friends changes
    friendx.value = newFriends;
  },
  { immediate: true } // This ensures that the watcher runs on initial load as well
);

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
    const response = await fetch(
      "https://chat-app-vue-js.onrender.com/searchuser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: searchinput.value }),
      }
    );
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
    const response = await fetch(
      "https://chat-app-vue-js.onrender.com/addfriend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myid, friendid }),
      }
    );
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
let group = ref(false);
</script>

<template>
  <div
    class="w-2/7 h-[95%] rounded-xl flex flex-col items-center justify-start scrollbar-hide bg-blue-300/60 shadow-[0px_0px_10px_rgba(0,0,0,0.6)] gap-2"
    v-if="!x"
  >
    <div class="flex items-center justify-center gap-4 w-[100%] mt-1 relative">
      <img :src="userimg" alt="Profile Image" class="w-20 h-20 rounded-full" />
      <h1 class="text-3xl py-1 font-mono">{{ props.username }}</h1>
      <OhVueIcon
        name="md-addcircle"
        class="w-10 h-10 text-white cursor-pointer hover:scale-120"
        v-if="y"
        @click="showburger"
        @mouseenter="group = true"
        @mouseleave="group = false"
      />
      <h2
        v-if="group"
        class="absolute right-[-40px] w-fit px-2 rounded-md h-8 bg-red-200 flex items-center justify-start"
      >
        Create Group
      </h2>
    </div>

    <div
      class="w-full h-7/9 flex flex-col items-center justify-start overflow-y-auto scrollbar-hide"
    >
      <form
        class="mt-2 w-11/12 h-12 bg-green-300/80 rounded-xl flex items-center justify-center gap-2 min-h-[50px] shadow-2xl"
        @submit.prevent="searchuser"
      >
        <input
          type="text"
          v-model="searchinput"
          class="w-4/6 h-4/5 rounded-lg border-none outline-none text-lg px-2 bg-white"
        />
        <button
          type="submit"
          class="w-1/5 h-4/5 text-lg flex items-center justify-center rounded-md bg-white hover:bg-green-500 hover:scale-110 cursor-pointer shadow-2xl"
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
            class="w-20 h-20 rounded-full"
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
        class="my-2 w-11/12 min-h-20 rounded-lg text-white bg-gray-300 shadow-xl flex items-center justify-center text-2xl cursor-pointer gap-4"
        @click="messageLoad(index)"
      >
        <img :src="friend.image" :alt="index" class="w-16 h-16 rounded-full" />
        <h1 class="font-mono text-3xl">{{ friend.name }}</h1>
      </div>
    </div>

    <button
      @click="logout()"
      class="w-24 h-10 border-none cursor-pointer rounded-md bg-white hover:bg-red-500 hover:scale-110 mb-2"
    >
      Log Out
    </button>
  </div>

  <!-- hamburger starts yeta bata -->
  <div
    v-if="x"
    class="w-[600px] h-[800px] absolute top-[40px] left-[20px] flex items-center justify-center max-[450px]:w-[300px] max-[750px]:left-[10px] max-[800px]:w-[400px] max-[800px]:h-[600px] max-[520px]:w-[80vw] max-[520px]:h-[600px]"
  >
    <OhVueIcon
      name="gi-hamburger-menu"
      class="w-12 h-12 text-black cursor-pointer hover:scale-120 absolute top-1.5 left-1.5 max-sm:left-0.5 max-[750px]:size-10 animate-pulse border-2 rounded-md"
      v-if="y"
      @click="showburger"
    />
    <div
      v-if="!y"
      class="w-[600px] h-[800px] bg-blue-500 rounded-2xl flex items-center justify-center flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-[800px]:w-[400px] max-[800px]:h-[600px] max-[520px]:w-[80vw] max-[520px]:h-[600px]"
    >
      <div
        class="absolute top-[2%] right-[2%] w-4 h-4 rounded-2xl bg-amber-950 cursor-pointer hover:bg-red-800 hover:scale-110"
        @click="showburger"
      ></div>
      <div class="flex items-center justify-center gap-4 w-[100%] mt-1">
        <img
          :src="userimg"
          alt="Profile Image"
          class="w-20 h-20 rounded-full"
        />
        <h1 class="text-3xl py-1 font-mono">{{ props.username }}</h1>
        <OhVueIcon
          name="md-addcircle"
          class="w-10 h-10 text-white cursor-pointer hover:scale-120"
          @click="showburger"
          @mouseenter="group = true"
          @mouseleave="group = false"
        />
        <h2
          v-if="group"
          class="absolute bottom-[-40px] w-fit px-2 rounded-md h-8 bg-red-200 flex items-center justify-start"
        >
          Create Group
        </h2>
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
              class="w-20 h-20 rounded-full"
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
          <img
            :src="friend.image"
            :alt="index"
            class="w-16 h-16 rounded-full"
          />
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
  </div>
</template>
