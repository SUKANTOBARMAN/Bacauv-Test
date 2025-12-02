import { defineStore } from "pinia";
export const useOfficeStore=defineStore("office",{
    state:()=>({
        officeId:null,
        officeDetails:null,
    }),
    getters:{
        getOfficeId:(state)=>state.officeId,
        getOfficeDetails:(state)=>state.officeDetails,
    },
    actions:{
        updateOfficeInfo(officeDetails){
            this.officeId=officeDetails.id;
            this.officeDetails=officeDetails;
        },
        removeOfficeInfo(){
            this.$reset();
            this.officeId=null;
            this.officeDetails=null;
        }
    },
    persist: {
    paths: ['officeId', 'officeDetails'] // Or just ['officeId'] if preferred
  }
})