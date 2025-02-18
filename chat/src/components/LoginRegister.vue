<script setup>
import { ref, reactive, computed } from "vue";
//for login
let forlogin = ref(true);

const props = defineProps({
  loginmatch: Boolean, //login complete bhayo ki nai check garna
});

const emit = defineEmits(["update-login", "update-friend"]);

//user details store
let lusername = ref();
let lpassword = ref();
let username = ref();
let password = ref();
let cpassword = ref();
let email = ref();

//database ma user ko details search garna
const loginuser = async () => {
  if (forlogin.value == false) {
    forlogin.value = true;
  } else {
    try {
      if (!lusername.value || !lpassword.value) {
        console.log("Please enter both username and password.");
        return;
      }

      // console.log("Login Attempt:", lusername.value, lpassword.value);

      const response = await fetch("http://localhost:3000/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: lusername.value,
          password: lpassword.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      const data = await response.json();
      // console.log(data);

      emit("update-login", true);
      emit("update-friend", data);
    } catch (error) {
      console.log("Error:", error);
    }
  }
};

//database ma user add garna
const registeruser = async () => {
  if (forlogin.value == true) {
    forlogin.value = false;
  } else {
    try {
      if (
        !username.value ||
        !email.value ||
        !password.value ||
        !cpassword.value
      ) {
        alert("Enter all values");
        return;
      }

      if (password.value !== cpassword.value) {
        alert("Passwords do not match");
        return;
      }

      const response = await fetch("http://localhost:3000/registeruser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          email: email.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Register Failed");
      }
      const data = await response.json();
      if (data == 0) {
        alert("User already exists");
      } else {
        // Emit event if login is successful
        emit("update-login", true);
        emit("update-friend", data);
      }
      // console.log(data);
    } catch (error) {
      console.log("error", error);
    }
  }
};
</script>
<template>
  <div
    v-if="!loginmatch"
    class="w-[80dvw] h-[80dvh] bg-cyan-500/80 rounded-2xl shadow-xl flex items-center justify-around"
  >
    <div class="w-[95%] h-[95%] flex items-center justify-center">
      <!-- Login Form -->
      <form
        class="w-1/2 h-full bg-gray-600 rounded-l-lg flex flex-col items-center justify-center gap-5 p-5"
        @submit.prevent="loginuser"
      >
        <div v-if="forlogin" class="w-full flex flex-col items-center gap-4">
          <div class="w-3/4 flex flex-col">
            <p class="self-start">User Name:</p>
            <input
              type="text"
              placeholder="kosul"
              v-model="lusername"
              class="w-full h-10 rounded-md px-4 bg-gray-100 focus:outline-none"
            />
          </div>
          <div class="w-3/4 flex flex-col">
            <p class="self-start">Password:</p>
            <input
              type="password"
              placeholder="password"
              v-model="lpassword"
              class="w-full h-10 rounded-md px-4 bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          class="w-24 h-10 rounded-md bg-black text-white transition-transform hover:scale-110 hover:bg-green-600"
        >
          Login
        </button>
      </form>

      <!-- Register Form -->
      <form
        class="w-1/2 h-full bg-lime-500/80 rounded-r-lg flex flex-col items-center justify-center gap-5 p-5"
        @submit.prevent="registeruser"
      >
        <div v-if="!forlogin" class="w-full flex flex-col items-center gap-4">
          <div class="w-3/4 flex flex-col">
            <p class="self-start">User Name:</p>
            <input
              type="text"
              placeholder="kosul"
              v-model="username"
              class="w-full h-10 rounded-md px-4 bg-gray-100 focus:outline-none"
            />
          </div>
          <div class="w-3/4 flex flex-col">
            <p class="self-start">Email:</p>
            <input
              type="email"
              placeholder="kosul"
              v-model="email"
              class="w-full h-10 rounded-md px-4 bg-gray-100 focus:outline-none"
            />
          </div>
          <div class="w-3/4 flex flex-col">
            <p class="self-start">Password:</p>
            <input
              type="password"
              placeholder="password"
              v-model="password"
              class="w-full h-10 rounded-md px-4 bg-gray-100 focus:outline-none"
            />
          </div>
          <div class="w-3/4 flex flex-col">
            <p class="self-start">Confirm Password:</p>
            <input
              type="password"
              placeholder="password"
              v-model="cpassword"
              class="w-full h-10 rounded-md px-4 bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          class="w-24 h-10 rounded-md bg-white text-black transition-transform hover:scale-110 hover:bg-blue-700 hover:text-white"
        >
          Sign Up
        </button>
      </form>
    </div>
  </div>
</template>
