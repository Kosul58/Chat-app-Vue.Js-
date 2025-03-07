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

      const response = await fetch(
        "https://chat-app-vue-js.onrender.com/loginuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: lusername.value,
            password: lpassword.value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      const data = await response.json();
      // console.log(data);

      localStorage.setItem("user", JSON.stringify(data));

      emit("update-login", true);
      emit("update-friend", data);
    } catch (error) {
      console.log("Error:", error);
    }
  }
};
let imageFile = ref(null);
const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0];
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
      const formData = new FormData();
      formData.append("username", username.value);
      formData.append("email", email.value);
      formData.append("password", password.value);
      formData.append("image", imageFile.value); // Append the file

      const response = await fetch(
        "https://chat-app-vue-js.onrender.com/registeruser",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Register Failed");
      }
      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

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
    class="w-[80dvw] h-[80dvh] bg-indigo-300 rounded-2xl shadow-xl flex items-center justify-around max-md:flex-wrap max-[800px]:h-[900px] max-[800px]:w-[60%] m-4 max-md:w-[400px]"
  >
    <div
      class="w-[95%] h-[95%] flex items-center justify-center max-[800px]:flex-wrap"
    >
      <!-- Login Form -->
      <form
        class="w-1/2 h-full bg-orange-300 rounded-l-lg flex flex-col items-center justify-center gap-5 p-5 max-[800px]:w-[100%] max-[800px]:h-[40%] max-[]"
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
        class="w-1/2 h-full bg-lime-500/80 rounded-r-lg flex flex-col items-center justify-center gap-5 p-5 max-[800px]:w-[100%] max-[800px]:h-[60%]"
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
          <div class="w-3/4 flex flex-col">
            <p class="self-start">Profile Image:</p>
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="w-full h-8 border-2 bg-blue-300 rounded-lg cursor-pointer hover:scale-105 text-center"
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
