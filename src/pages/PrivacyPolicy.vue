<template>
  <q-layout view="lHh Lpr lFf">
    
    <q-page-container>
      
      <q-page class="bg-grey-1 flex flex-center">
        <div class="q-pa-md" style="max-width: 800px; width: 100%">
          
          <q-card flat class="bg-transparent text-center q-mb-lg">
            <q-avatar size="80px" color="primary" text-color="white" icon="security" class="shadow-3" />
            <div class="text-h4 text-weight-bold q-mt-md text-primary">Privacy Policy</div>
            <div class="text-subtitle1 text-grey-7">BACUAV Mobile Application</div>
          </q-card>

          <div class="q-gutter-y-md">
            
            <q-expansion-item
              group="policy"
              icon="info"
              label="1. Introduction"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
              default-opened
            >
              <q-card>
                <q-card-section class="text-body1 text-grey-8 text-justify">
                  Welcome to the BACUAV mobile application. We value your privacy and are committed to protecting the personal information of our members. This Privacy Policy explains how we collect, use, store, and protect your information when you use our digital services.
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="policy"
              icon="folder_shared"
              label="2. Information We Collect"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
            >
              <q-card>
                <q-card-section class="text-grey-8">
                  <div class="text-weight-bold q-mb-sm">Personal Information:</div>
                  <div class="row q-gutter-sm q-mb-md">
                    <q-chip v-for="info in personalInfo" :key="info" color="blue-1" text-color="blue-9" icon="check_circle" size="sm">
                      {{ info }}
                    </q-chip>
                  </div>

                  <div class="text-weight-bold q-mb-sm">Media & Storage Access:</div>
                  <p class="text-body2">To download official notices, circulars, documents, or to upload profile photos.</p>

                  <div class="text-weight-bold q-mb-sm">Device Information:</div>
                  <p class="text-body2">Device model and OS version for app functionality and performance.</p>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="policy"
              icon="settings_applications"
              label="3. How We Use Your Information"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
            >
              <q-card>
                <q-card-section>
                  <q-list dense>
                    <q-item v-for="(use, index) in usageList" :key="index">
                      <q-item-section avatar>
                        <q-icon color="secondary" name="arrow_right" />
                      </q-item-section>
                      <q-item-section class="text-body2">{{ use }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="policy"
              icon="share"
              label="4. Data Sharing and Disclosure"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
            >
              <q-card>
                <q-card-section class="q-gutter-y-sm text-grey-8">
                  <div>
                    <q-icon name="groups" color="primary" size="xs" /> 
                    <span class="text-weight-bold q-ml-xs">Internal Access:</span> 
                    Details like name and designation may be visible to other verified members.
                  </div>
                  <q-separator />
                  <div>
                    <q-icon name="business" color="primary" size="xs" />
                    <span class="text-weight-bold q-ml-xs">Third-Party Services:</span> 
                    We do not sell data. Limited sharing with trusted technical support solely for maintenance.
                  </div>
                  <q-separator />
                  <div>
                    <q-icon name="gavel" color="primary" size="xs" />
                    <span class="text-weight-bold q-ml-xs">Legal Compliance:</span> 
                    Disclosed if required by laws in Bangladesh.
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="policy"
              icon="security"
              label="5. Data Security"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
            >
              <q-card>
                <q-card-section class="text-body2 text-justify text-grey-8">
                  We adopt appropriate technical and organizational security measures to protect personal data from unauthorized access, misuse, alteration, or loss. Access is restricted to authorized personnel only.
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="policy"
              icon="accessibility_new"
              label="6. User Rights"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
            >
              <q-card>
                <q-card-section>
                   <q-list separator>
                     <q-item>
                       <q-item-section avatar><q-icon name="visibility" color="accent" /></q-item-section>
                       <q-item-section>View and review your personal information</q-item-section>
                     </q-item>
                     <q-item>
                       <q-item-section avatar><q-icon name="edit" color="accent" /></q-item-section>
                       <q-item-section>Request updates or corrections (promotions, posting changes)</q-item-section>
                     </q-item>
                     <q-item>
                       <q-item-section avatar><q-icon name="delete_forever" color="negative" /></q-item-section>
                       <q-item-section>Request account deletion upon retirement</q-item-section>
                     </q-item>
                   </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item
              group="policy"
              icon="update"
              label="7. Changes to Policy"
              header-class="bg-white text-primary text-weight-bold shadow-1 rounded-borders"
              class="bg-white shadow-1 rounded-borders overflow-hidden"
            >
               <q-card>
                <q-card-section class="text-body2 text-grey-8">
                  We reserve the right to update or modify this Privacy Policy at any time. Any changes will be reflected within the application. Users are encouraged to review this policy periodically.
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-card class="bg-primary text-white q-mt-xl shadow-4">
              <q-card-section>
                <div class="text-h6 text-weight-bold flex items-center">
                  <q-icon name="contact_support" size="sm" class="q-mr-sm"/> 8. Contact Information
                </div>
                <div class="q-mt-sm opacity-80">
                  If you have any questions or concerns regarding this Privacy Policy, please contact us.
                </div>
              </q-card-section>
              <q-separator dark />
              <q-card-actions align="around" class="q-pa-md">
                <q-btn flat icon="email" label="bacuav2024@gmail.com" type="a" href="mailto:bacuav2024@gmail.com" />
                <div class="text-caption text-center">
                  <q-icon name="place" /> Agargaon, Dhaka
                </div>
              </q-card-actions>
            </q-card>

            <div class="row justify-center q-mt-lg q-mb-xl" >
               <q-btn to="/login" label="I Understand & Agree" color="primary" unelevated rounded padding="10px 40px" @click="acceptPolicy" />
            </div>

          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'PrivacyPolicyPage',
  data() {
    return {
      personalInfo: [
        'Name', 
        'Designation', 
        'Employee/ID', 
        'Workplace', 
        'Mobile Number', 
        'Email', 
        'Blood Group'
      ],
      usageList: [
        'Maintaining an accurate digital directory of members',
        'Enabling communication among verified members',
        'Sending notifications (meetings, elections, welfare)',
        'Verifying membership authenticity and status'
      ]
    }
  },
  methods: {
    acceptPolicy() {
      // Logic to accept policy (e.g., save to local storage or API)
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'check_circle',
        message: 'You have agreed to the Privacy Policy'
      })
      
      // ড্যাশবোর্ডে রিডাইরেক্ট করতে চাইলে নিচের লাইনটি আনকমেন্ট করুন
      // this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.opacity-80 {
  opacity: 0.8;
}
</style>