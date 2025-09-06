import {defineStore} from "pinia";
import {my_info} from "@/api/user";
import {User} from "@/store/user";

export const useGameStore = defineStore("game", {
    state: () => ({
        operators: [{
            id: 1,
            name: "小帅哥",
            avatar: "/assets/operators/b3.png",
            score: 1600,
        }]
    }),
    actions: {
        log() {
            console.log(this.operators)
        }
    }
})