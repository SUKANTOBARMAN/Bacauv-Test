import { api } from "boot/axios";
import { defineStore } from "pinia";

const defaultStore = () => {
  return {
    counter: 0,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    user: JSON.parse(localStorage.getItem("user")) || {
      name: null,
      accessToken: null,
    },
    commissionerate:[],
    division: [],
    circle:[],
    district:[]
  };
};

export const useStore = defineStore("store", {
  state: () => defaultStore(),
  getters: {
    doubleCount: (state) => state.counter * 2,
    getCommissionerate:(state)=> state.commissionerate,
    getDistrict:(state)=> state.district,
    getDivision:(state)=> state.division,
    getCircle:(state)=> state.circle,
    getAccessToken: (state) => state.user.accessToken,
    isAuthenticated: (state) => !!state.user.accessToken,
    getUserName: (state) => (state.user ? state.user.name : null),
  },
  actions: {
    resetState() {
      Object.assign(this, defaultStore());
    },
   async storeCommissionerate(data){
      try{
        const response=await api.get('v1/categories?limit=0&search=type:commissionerate')
        const data=response.data.data
        this.commissionerate=[]
        data.map(item=>{
          this.commissionerate.push({
            label: item.name,
            value:item.id,
            parent_id:item.parent_id
          })})
      }catch(error){
        console.log(error)
      }
    },

   async storeDivision(){
      try{
        const response=await api.get('v1/categories?limit=0&search=type:division')
        const data=response.data.data
        this.division=[]
        data.map(item=>{
          this.division.push({
            label: item.name,
            value:item.id,
            parent_id:item.parent_id
          })})
      }catch(error){
        console.log(error)
      }
    },
   async storeCircle(){
      try{
        const response=await api.get('v1/categories?limit=0&search=type:circle')
        const data=response.data.data
        this.circle=[]
        data.map(item=>{
          this.circle.push({
            label: item.name,
            value:item.id,
            parent_id:item.parent_id
          })})
      }catch(error){
        console.log(error)
      }
    },
    async storeDistrict(){
      try{
        const response=await api.get('v1/categories?limit=0&search=type:district')
        const data=response.data.data
        this.district=[]
        data.map(item=>{
          this.district.push({
            label: item.name,
            value:item.id,
          })})
      }catch(error){
        console.log(error)
      }
    },
    // getDivision(id){
    //   return this.division.filter(item=>item.parent_id===id)
    // },
    // getCircle(id){
    //   return this.circle.filter(item=>item.parent_id===id)
    // },



    async getCategories() {
      await api
        .get("/categories/category?limit=0")
        .then((response) => {
          this.categories = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    login(user) {
      this.user = user;
      console.log("Hiii")
      localStorage.setItem("user", JSON.stringify(user));
    },

    logout() {
      this.refreshToken = null;
      localStorage.removeItem("user");
      this.user = null;
    },


  },
});
