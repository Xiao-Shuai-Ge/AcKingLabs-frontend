import { defineStore } from "pinia";

export interface User {
  user_id: string;
  username: string;
  avatar: string;
  atoken: string;
  rtoken: string;
  role: number;
  xp: number;
  // 其他用户属性
}

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: {
      user_id: "",
      username: "",
      avatar: "",
      role: 0,
      xp: 0,
      atoken: "",
      rtoken: "",
    } as User,
  }),
  actions: {
    getUserInfo() {
      return {
        user_id: this.currentUser.user_id,
        username: this.currentUser.username,
        avatar: this.currentUser.avatar,
        role: this.currentUser.role,
        xp : this.currentUser.xp
      }
    },
    setUserInfo(data: { user_id: string, username: string, avatar: string , role: number , xp: number }) {
      // 如果有token本地信息，更新
      this.getAtoken()
      this.getRtoken()
      // 更新用户信息
      this.currentUser.user_id = data.user_id;
      this.currentUser.username = data.username;
      this.currentUser.avatar = data.avatar;
      this.currentUser.role = data.role;
      this.currentUser.xp = data.xp;
    },
    setAtoken(atoken: string) {
      localStorage.setItem("atoken", atoken);
      this.currentUser.atoken = atoken;
    },
    setRtoken(rtoken: string) {
      localStorage.setItem("rtoken", rtoken);
      this.currentUser.rtoken = rtoken;
    },
    logout() {
      localStorage.removeItem("atoken");
      localStorage.removeItem("rtoken");
      this.setUserInfo({ user_id: "", username: "", avatar: "" , role: 0 , xp: 0 });
    },
    getAtoken() {
      if (!this.currentUser.atoken) {
        this.currentUser.atoken = localStorage.getItem("atoken") || "";
      }
      return this.currentUser.atoken;
    },
    getRtoken() {
      if (!this.currentUser.rtoken) {
        this.currentUser.rtoken = localStorage.getItem("rtoken") || "";
      }
      return this.currentUser.atoken;
    },
    isLogin() {
      this.getAtoken()
      return this.currentUser.atoken != "";
    },
    log() {
      console.log(this.currentUser)
    }
  }
})