<script setup>
import { ref, reactive, computed, defineProps, defineEmits } from "vue";
//for login
let forlogin = ref(true);

const props = defineProps({
  loginmatch: Boolean, // Accepting loginmatch as a prop
});

const emit = defineEmits(["update-login"]);

let lusername = ref();
let lpassword = ref();
let username = ref();
let password = ref();
let cpassword = ref();
let email = ref();

const loginuser = async (e) => {
  try {
    e.preventDefault();
    if (forlogin.value == false) {
      forlogin.value = true;
    }
    console.log(lusername.value, lpassword.value);
    console.log("login attempt");

    const logger = await fetch("https://localhost:3000/registeruser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: lusername, password: lpassword }),
    });

    const data = await loginuser.json();
    console.log(data);
  } catch (error) {
    console.log("error", error);
  }
  // emit("update-login", true);
};

const registeruser = async (e) => {
  e.preventDefault();
  if (forlogin.value == true) {
    forlogin.value = false;
  }
  console.log(username.value, email.value, password.value, cpassword.value);
};
</script>

<template>
  <div class="chat-main" v-if="!loginmatch">
    <div class="formselect">
      <form class="loginform">
        <div class="loginforminside" v-if="forlogin">
          <div>
            <p>User Name:</p>
            <input type="text" placeholder="kosul" v-model="lusername" />
          </div>
          <div>
            <p>Password:</p>
            <input type="password" placeholder="password" v-model="lpassword" />
          </div>
        </div>
        <button @click="loginuser($event)">Login</button>
      </form>
      <form class="registerform">
        <div class="registerforminside" v-if="!forlogin">
          <div>
            <p>User Name:</p>
            <input type="text" placeholder="kosul" v-model="username" />
          </div>
          <div>
            <p>Email:</p>
            <input type="email" placeholder="kosul" v-model="email" />
          </div>
          <div>
            <p>Password:</p>
            <input type="password" placeholder="password" v-model="password" />
          </div>
          <div>
            <p>Confirm Password:</p>
            <input
              type="confirm password"
              placeholder="password"
              v-model="cpassword"
            />
          </div>
        </div>
        <button @click="registeruser($event)">SignUp</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.formselect {
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.loginform {
  width: 50%;
  height: 100%;
  background-color: rgba(245, 237, 237, 0.8);
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-direction: column;
}

.loginforminside {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.registerforminside {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loginforminside div,
.registerforminside div {
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loginforminside div p,
.registerforminside div p {
  align-self: flex-start;
}

.loginform input,
.registerform input {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  outline: none;
  border: none;
  padding-left: 20px;
}

.loginform button {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-color: black;
  color: white;
  cursor: pointer;
}

.loginform button:hover {
  scale: 1.2;
  background-color: rgb(11, 146, 54);
}

.registerform {
  width: 50%;
  height: 100%;
  background-color: rgba(90, 224, 38, 0.8);
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-direction: column;
}

.registerform button {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-color: rgb(247, 242, 242);
  color: rgb(11, 11, 11);
  cursor: pointer;
}

.registerform button:hover {
  scale: 1.2;
  background-color: rgba(19, 38, 186, 0.8);
  color: white;
}
</style>
