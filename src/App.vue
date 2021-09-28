<template>
  <v-app>
    <Navbar />
    <v-main class="ma-4">
      <router-view></router-view>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Navbar  from '@/components/Navbar'
import Footer from '@/components/Footer'

export default ({
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
   data() {
    return {
      subscription : [
        {
          topic: 'countup',
          qos: 0,
        },
        {
          topic: 'backup',
          qos: 0,
        },
        {
          topic: 'state',
          qos: 0,
        },
        {
          topic: 'setting/finish',
          qos: 0,
        },
        {
          topic: 'reset/tool',
          qos: 0,
        },
        {
          topic: 'reset/workcount',
          qos: 0,
        },
        {
          topic: 'countup/allTool',
          qos: 0,
        },
      ],

      enc: new TextDecoder("utf-8"),

      requestTimeInterval: 600000,
    }
  },

  computed: {
    stcList: {
      get() {
        return this.$store.getters['stc/getStcList'];
      }
    },
    dataReady: { // 서버로 부터 정보 수신 대기
      set(newValue) {
        this.$store.dispatch('app/SetDataReady', newValue);
      },
      get() {
        return this.$store.getters['getDataReady'];
      }
    }
  },

  methods: {
    MqttSubTopic() {
      let subArr = this.subscription;
      
      for (let i = 0; i < subArr.length; i++) {
        let sub = subArr[i];

        console.log('sub topic : ', sub.topic);

        this.$mqtt.subscribe(sub.topic, (err, grain) => {
          if (err) {
            console.log('mqtt sub error : ', sub.topic);
          } else {
            console.log('mqtt sub success : ', grain);
          }
        })
      }

    },

    Uint8ToJSON(val) {
      return JSON.parse(this.enc.decode(val));
    },

    IsStcCorrect(msg, stcId) {
      if (msg['stc-id'] == stcId) {
        return true;
      }
      return false;
    },

    AllToolCntUp(stcId) {
    },

    ResetToolCount(stcId, toolNo) {
    },

    ResetWorkCount(stcId) {
    },

    CountupAllTool(stcId) {
    },

    RequestMqtt() {
      console.log('request mqtt');

      this.$mqtt.publish('request', '101');
    },

    UpdateStcToolCount(msg) {
      console.log('update tool count');

    },

    UpdateStcState(stcId, status) {
      console.log('update stc status');

    },

    UpdateGraphData() {
      console.log('update graph data');

    },

    UpdateNewLog(stcId, msg) {
      let date = new Date();
      let log = {
        date: date.toLocaleString(),
        msg: stcId + ' -> ' + msg,
      };

    },
  },
  async mounted() {
    this.MqttSubTopic();

    this.RequestMqtt();

    setInterval(this.RequestMqtt, this.requestTimeInterval);

  },
  mqtt: {
    // stc에서 사용량이 1증가하여 사용중인 툴의 사용량과 워크 카운터가 1증가한다.
    // 이에 따라 stcList의 해당 STC의 툴 수명과 workcount 속성값을 1 증가 시킨다.
    // 그후 로그 메시지를 출력한다.
    'countup' : function(val) {
      let msg = this.Uint8ToJSON(val);
      
      console.log('count up : ', msg);

      this.AllToolCntUp(msg['stc-id']);

      this.UpdateNewLog(msg['stc-id'], '툴 카운터 업');
    },

    // STC에서 주기적으로 해당 STC의 공구 수명 값과 워크 카운터 값을 보낸다.
    // 해당 데이터를 기점으로 STCWMS의 데이터를 동기화 한다.  stcList, GraphData
    // 주기는 개발용 으로 1분이지만 실제로는 5분정도로 설정을 해두어야 한다.
    'backup': function(val) {
      let msg = this.Uint8ToJSON(val);

      console.log('back up : ', msg);

      // this.UpdateStcToolCount(msg);
      // this.UpdateStcState(msg['stc-id'], 401);
      // this.UpdateGraphData();

      // this.UpdateNewLog(msg['stc-id'], '백업 데이터 수신');
    },

    // STC에서 툴을 초기화 했을 때 수행한다.
    // 대상 STC의 해당 공구 데이터를 0으로 초기화 한다.
    'reset/tool': function(val) {
      let msg = this.Uint8ToJSON(val);
      
      console.log('reset/tool', msg);

      this.ResetToolCount(msg['stc-id'], msg['toolNo']);

      this.UpdateNewLog(msg['stc-id'], msg['toolNo'] + '번 툴 교체');
    },

    // STC에서 작업자 교대를 목적으로 워크 카운터를 초기화 했을 때 수행한다.
    // 대상 STC의 워크 카운터를 0으로 초기화 한다.
    'reset/workcount': function(val) {
      let msg = this.Uint8ToJSON(val);

      console.log('reset/workcount', msg);

      this.ResetWorkCount(msg['stc-id']);

      this.UpdateNewLog(msg['stc-id'], '워크카운터 교체');
    },

    // STC에서 특수한 사정으로 워크 카운터를 제외한 모든 툴의 사용량을 1 증가 시킬 때 수행한다.
    // countup의 동작과 유사하지만 워크 카운터를 제회하고 증가 시킨다.
    'countup/allTool': function(val) {
      let msg = this.Uint8ToJSON(val);

      console.log('countup/allTool', msg);

      this.CountupAllTool(msg['stc-id']);

      this.UpdateNewLog(msg['stc-id'], '모든 툴 카운터 업');
    },

    // STC에서 보내오는 상태정보를 수집하고 각각의 상태에 맞는 로그를 출력한다.
    // 디비 테이블의 로그 상태 표를 참조할 것
    'state': function(val) {
      let msg = this.Uint8ToJSON(val);

      console.log('state', msg);

      let stcId = msg['stc-id'];
      let eventCode = msg['eventCode'];

      console.log(stcId, eventCode);

    }
    
    // 'setting/finish': function(val) {
    //   let msg = this.Uint8ToJSON(val);

    //   console.log('setting/finish', msg);


    // },

  },
})


</script>
