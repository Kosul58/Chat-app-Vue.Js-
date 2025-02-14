<script setup>
import { ref, reactive, computed, defineProps, defineEmits } from "vue";
//for login
let forlogin = ref(true);

const props = defineProps({
  loginmatch: Boolean, // Accepting loginmatch as a prop
});

const emit = defineEmits(["update-login", "update-friend"]);

let lusername = ref();
let lpassword = ref();
let username = ref();
let password = ref();
let cpassword = ref();
let email = ref();

const loginuser = async () => {
  if (forlogin.value == false) {
    forlogin.value = true;
  } else {
    try {
      if (!lusername.value || !lpassword.value) {
        console.log("Please enter both username and password.");
        return;
      }

      console.log("Login Attempt:", lusername.value, lpassword.value);

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
      console.log(data);
      // Emit event if login is successful
      emit("update-login", true);
      emit("update-friend", data);
    } catch (error) {
      console.log("Error:", error);
    }
  }
};

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
      console.log(data);
    } catch (error) {
      console.log("error", error);
    }
  }
};
</script>

<template>
  <div class="chat-main" v-if="!loginmatch">
    <div class="formselect">
      <form class="loginform" @submit.prevent="loginuser">
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
        <button type="submit">Login</button>
      </form>
      <form class="registerform" @submit.prevent="registeruser">
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
            <input type="password" placeholder="password" v-model="cpassword" />
          </div>
        </div>
        <button type="submit">SignUp</button>
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
