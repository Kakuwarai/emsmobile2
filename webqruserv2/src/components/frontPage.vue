<style>
.tblEmployeeData tr:nth-child(odd){
background-color: rgb(250, 250, 250);
}
.tblEmployeeData tr{
  border-bottom: 1px solid rgb(232, 232, 232);
}
.tblEmployeeData th{
  background-color: rgb(232, 232, 232);
}
.tblEmployeeData{
  border-collapse: collapse;
  font-size:15px;
}

/* modal */
.modal-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity .3s ease;
  }
  
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  
  .modal-container {
    vertical-align: middle;
    z-index: 2000;
    background-color:transparent;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }
  

  .modal-body {
    border: none;
    background-color: transparent;
  }

/* end modal */

div.scrollmenu {
  /* background-color: #333; */
  overflow: auto;
  white-space: nowrap;
  position: absolute;
  width: 95%;
  bottom: 90px;
}

div.scrollmenu a {
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px;
  text-decoration: none;
}

div.scrollmenu a:hover {
  background-color: #777;
}
</style>
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue3-qrcode-reader'
import moment from 'moment';

//const rootLink = ref(`https://apps.fastlogistics.com.ph/scanapi/api/`)
 const rootLink = ref(`https://apps.fastlogistics.com.ph/scanapi/api/`)
const scannedContent = ref([])
const imageDatas = ref([])
const scannedContentDateTime = ref([])
const loader = ref('none')
const notyet = ref(false)
const evntday = ref('')
const modalImage = ref(false)
const route = useRoute()

onMounted(()=>{
  onDecode()
})

  function onDecode () {

  loader.value = 'inline-block'
  camera.value = false
  var decodedString = route.query.id.replace('http://localhost:8080/#/?id=', '')

  var arrQrData = decodedString.split('-')

  let formDataImage = new FormData();
                let configImage = {
                          headers : {
                              'Content-Type' : 'multipart/form-data'
                          }
                      }

                      formDataImage.append("evtId",arrQrData[0])

              axios.post(`${rootLink.value}EmsEventschedulemembers/eventMobileImages`,
              formDataImage,configImage).then(function(resImage){
                    if(resImage.status == 200){
                      imageDatas.value = resImage.data
                    }
            })


    let formData = new FormData();
                let config = {
                          headers : {
                              'Content-Type' : 'multipart/form-data'
                          }
                      }

        formData.append("evtId",arrQrData[0])
        formData.append("memberId",arrQrData[1])

              axios.post(`${rootLink.value}EmsEventschedulemembers/employeeDetails`,
            formData,config).then(function(res){
     
              if(res.status == 200){
                scannedContent.value = res.data
                loader.value = 'none'
                openClose.value = 'none'

                

                let formDatas = new FormData();
                let configs = {
                          headers : {
                              'Content-Type' : 'multipart/form-data'
                          }
                      }

        formDatas.append("evtId",arrQrData[0])
        formDatas.append("memberId",arrQrData[1])

              axios.post(`${rootLink.value}EmsEventschedulemembers/days`,
            formDatas,configs).then(function(resday){
              evntday.value = resday.data
             
            })


              }else if(res.status == 208 || res.status == 202){
                scannedContent.value = ''
                notyet.value = true
                loader.value = 'none'
                let timer = 1;
                let interval = setInterval(() => {
                  if (timer === 0) {
                   clearInterval(interval)   
                   notyet.value = false
                   openClose.value = 'none'
                    } else {
                      timer--

                        }             
                          }, 1000)
              }
          

            }).catch((error) => {
              scannedContent.value = ''
              notyet.value = true
              loader.value = 'none'
              let timer = 1;
                let interval = setInterval(() => {
                  if (timer === 0) {
                   clearInterval(interval)   
                   notyet.value = false         
                   openClose.value = 'none'
                    } else {
                      timer--

                        }             
                          }, 1000)


            })

            
      
       
               
   
           
 }

function dateTime(value) {
     return moment(value).format('MMMM D, YYYY');
    }
    function date(value) {
      return moment(value).format('MM/DD/YYYY');
    }

    function time(value) {
      return moment(value).format('hh:mm A');
    }

const showScanConfirmation = ref(false)


const openClose = ref('none')
const camera = ref(false)
    function openCamera(){

      camera.value = true
      openClose.value = 'inline-block' 

    }

function webReset(){
  scannedContent.value = ''
}

const selectedImagepath = ref('')
function imgClick(content){
  selectedImagepath.value = `https://apps.fastlogistics.com.ph/fastdrive/${content.imagePath}${content.images}`
  modalImage.value = true
}
</script>

<template>
<div style="width: 100%;">
<div>
  <img :style="{'width':'150px'}" src="../assets/fastLogo.png">
</div>
<br>



<div >

<pre style="font-size: 18px;"> <span style="font-weight: bold;font-size: 20px;">{{ scannedContent.title }}</span>
Day {{ evntday }}
Venue: {{ scannedContent.venue }}
<!-- Start Date: {{ dateTime(scannedContent.startDate) }}
End Date: {{  dateTime(scannedContent.endDate) }} -->
</pre>
<!-- <p>{{ dateTime(scannedContent.startDate) }} - {{ dateTime(scannedContent.endDate) }}</p> -->
  


</div>
<br>
<div  style="text-align: left;">

<p><span style="color:blue">Name:</span> {{ scannedContent.firstname }} {{ scannedContent.middlename }} {{ scannedContent.lastname }}</p>
<p><span style="color:blue">Team:</span> {{ scannedContent.group }}</p>
<p><span style="color:blue">Room no.:</span> {{ scannedContent.room }}</p>
<p><span style="color:blue">Table no.:</span> {{ scannedContent.table }}</p>
<!-- <p>Log Time: {{ scannedContent.logTime }}</p>
<p>Log Date: {{ scannedContent.logDate }}</p> -->
<div style="overflow: auto;">
<table style="width: 300px;" class="tblEmployeeData">
<th style="padding:10px; color: blue;">Date</th>
<th style=" adding: 10px; color: blue;">Time</th>
<tr>
<td>{{ date(scannedContent.logdate)  }}</td>
<td>{{ time(`${scannedContent.logdate}`) }}</td>
</tr>
</table>
</div>

</div>

</div>

<!-- <img v-if="scannedContent.employeename2 == null && loader == 'none'" style="width:200px; margin-top: 20px;" src="../assets/barcode-scan.png"> -->



<!-- <img @click="modalImage1 = true" style="height: 100px; position: absolute; bottom: 100px; left: 2px;" 
v-if="scannedContent.eventDate != null" src="../assets/picProgramFlow1.jpg">

<img @click="modalImage2 = true" style="height: 100px; position: absolute; bottom: 100px; left: 70px;" 
v-if="scannedContent.eventDate != null" src="../assets/picProgramFlow2.jpg"> -->



<div class="scrollmenu" >
  <a v-for="content, index in imageDatas"> <img @click="imgClick(content)" :src="`https://apps.fastlogistics.com.ph/fastdrive/${content.imagePath}${content.images}`" alt="Snow" style="height: 100px">
 </a>

</div>


<footer style="text-align: center;position: fixed;bottom: 0;">
  <p style="font-weight: bold;">Fast Services Corporation 2023<br></p>
</footer>


<div >    
      <modal  v-if="modalImage" @close="modalImage = false">
        <slot >
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div @click="modalImage = false" class="modal-container" id="modalImage">
       
              <div class="modal-body" >
                <slot>
                  <pre style="color: white;">Click image to close</pre>
                  <img @click="modalImage = false" style="width: 95%; margin: 0 auto;  display: block;" :src="selectedImagepath">
                </slot>
              </div>
             
            </div>
          </div>
        </div>
      </slot>
      </modal>
    </div>

  

</template>
