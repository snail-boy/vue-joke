<template>
  <div>
    <div class="link">
      <el-menu default-active="1-3-1" class="el-menu-vertical-demo"
               mode="horizontal">

        <el-menu-item index="1" class="el-menu-item">
          <router-link :to="{name:'joke',params:{id:1}}">文字笑话</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link :to="{name:'joke',params:{id:2}}">静图笑话</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link :to="{name:'joke',params:{id:3}}">动图笑话</router-link>
        </el-menu-item>
      </el-menu>

    </div>


      <div class="input-box" v-show="inputShow">
        <transition-group name="down">
        <input type="text" v-model.lazy="reqPage" placeholder='输入页数按enter' v-on:keyup.enter="clickReq(reqPage)" :key="1">
        <span class="sure" @click="clickReq(reqPage)" :key="2">确定</span>
        </transition-group>

      </div>


    <div class="main-box">
      <scroll ref="scroll"
              class="main-content"
              :pullup="pullup"
              @scrollToEnd="scrollToEnd"
              @scrollToStart="scrollToStart"
              @scroll="scroll"
      >
        <div class="main">

            <ul>

              <transition-group name="slide-fade">
                <li v-for="(item,index) in list" :class="{active:index === currentItem}" @click="click(index)" :key="index">
                  <h4 class="joke-title">{{(currentPage-1)*10+index+1}}.&nbsp;{{item.title}}</h4>
                  <!--<p v-if="item.text" >{{item.text.replace(/<[^>]+>/g,"")}}</p>-->
                  <p v-if="item.text" v-html="item.text" class="joke-content">{{item.text}}</p>

                  <img v-else v-lazy="item.img" alt="" @load="loadImage" @click="clickImg(index)" ref="image">
                  <p class="timeBox"><span class="time">生成时间:<i>{{item.ct | format}}</i></span></p>
                </li>
              </transition-group>

            </ul>
        </div>
      </scroll>
    </div>



    <footer>
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="prevPage">上一页</el-button>
        <el-button type="primary" @click="nextPage">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        <el-button type="primary">共{{allPages}}页</el-button>
        <el-button type="primary">当前{{currentPage}}页</el-button>
      </el-button-group>
    </footer>


    <loading v-if="loading" :loading="loading"></loading>
    <a href="javascript:;" class="goBack" @click="scrollTo(300)"></a>



  </div>
</template>

<script>
  import {joke} from '../../api/rank'
  import {commonParams} from "../../api/config";
  import loading from '../loading/loading'
  import scroll from './scroll'


  export default {
    data() {
      return {
        currentItem: -1,
        list: [],
        textList: [],
        picList: [],
        gifList: [],
        isCollapse: true,
        allPages: '',
        currentPage: '',
        num: '',
        loading: false,
        reqPage:'',
        pullup:true,
        scrollY:0,
        inputShow:false
      }

    },
    filters: {
      format(value) {
        if (!value) return '';
        return value.split('.')[0] + '.' + Math.round(+(value.split('.')[1]) / 10)
      }
    },
    components: {
      loading,
      scroll
    },
    created() {
      this.$nextTick(() => {
        this._getJoke();
        this.list.currentItem = -1
      })
    },

      updated(){
          this.$nextTick(() => {
              this._getJoke();
      })
      },

    watch: {
      $route: {
        handler(to) {
          let index = to.params.id;
          if (index === 1) {
            this.list = this.textList;
          }
          if (index === 2) {
            this.list = this.picList;
          }
          if (index === 3) {
            this.list = this.gifList;
          }
          this._getJoke(to.params.id)
        },
        immediate: true
      },
      scrollY(newVal){
        if(newVal<-600){
          this.inputShow = true
        }else {
          this.inputShow = false
        }
      }
    },
    methods: {
      _getJoke(type = 1) {
        switch (type) {
          case 1:
            if (!this.textList.length) {
              this.requestData(type);
            }
            break;
          case 2:
            if (!this.picList.length) {
              this.requestData(type);
            }
            break;
          case 3:
            if (!this.gifList.length) {
              this.requestData(type);
            }
            break;
        }
      },
      requestData(type) {
        joke(type).then((res) => {
          if (type === 1) {
            this.textList = res.showapi_res_body.contentlist;
            this.list = this.textList;
          }
          if (type === 2) {
            this.picList = res.showapi_res_body.contentlist;
            this.list = this.picList;
          }
          if (type === 3) {
            this.gifList = res.showapi_res_body.contentlist;
            this.list = this.gifList;
          }
          this.allPages = res.showapi_res_body.allPages;
          this.currentPage = res.showapi_res_body.currentPage
        })
      },
      nextPage() {
        const type = this.$route.params.id;
        const page = commonParams.page;
        this.loading = true;
        joke(type, page).then((res) => {
          this.list = res.showapi_res_body.contentlist;
          this.scrollTo()
          setTimeout(()=>{
            commonParams.page++;
            this.currentPage++;
            this.loading = false;
          },2000)

          this.textList = '';
          this.picList = '';
          this.gifList = '';
        })
      },
      prevPage() {
        commonParams.page--;
        const type = this.$route.params.id;
        const page = commonParams.page;
        joke(type, page).then((res) => {
          this.list = res.showapi_res_body.contentlist;
          setTimeout(()=>{
            this.currentPage--;
            this.scrollTo()
          },2000)
        });
        this.textList = '';
        this.picList = '';
        this.gifList = '';
      },

      click(item) {
        this.currentItem = item;
      },
      clickImg(item) {
        if (!this.$refs.image[item].className) {
          this.$refs.image[item].className = 'activeImg'
        } else {
          this.$refs.image[item].className = ''
        }
      },
      clickReq(page){
        this.reqPage = '';
        const type = this.$route.params.id;
         joke(type, +page).then((res) => {
          this.list = res.showapi_res_body.contentlist;
            this.currentPage = page;
           this.scrollTo()
      });
      },
      loadImage(){
        if(!this.checkloaded){
          this.checkloaded = true;
          this.$refs.scroll.refresh()
        }
      },
      scrollToEnd(){
        const type = this.$route.params.id;
        const page =this.currentPage++;
        joke(type, +page).then((res) => {
          this.list = res.showapi_res_body.contentlist;
          this.scrollTo(100)
        });
      },
      scrollToStart(){
        const type = this.$route.params.id;
        if(this.currentPage<=1){
          this.currentPage = 1
        }else{
          const page =this.currentPage--;
          joke(type, +page).then((res) => {
            this.list = res.showapi_res_body.contentlist;
          });
        }

      },
      scrollTo(speed){
        this.$refs.scroll.scrollTo(0,0,speed)
      },
      scroll(pos){
        this.scrollY = pos.y;
      }
    },



  }
</script>

<style type="text/css" lang="scss">

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100%);
    opacity: 0;
  }

  .down-enter-active{
    transition: 1s ease;
  }
  .down-leave-active{
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .down-enter,.down-leave-to{
    transform:translateY(500px);
    opacity: 0;
  }
  ul li {
    width: 90%;
    font-size: 14px;
    list-style: none;
    margin: 0 auto;
    box-sizing: border-box;
  }

  a {
    font-size: 16px;
    text-decoration: none;
  }

  .link {
    text-align: center;
  .el-menu-vertical-demo a.active {
    color: #303133;
  }

  }

  .main {
    padding-top: 120px;
    padding-bottom: 120px;
    ul{
      -webkit-padding-start: 0;

    }
  ul li {
    transition: all .3s;
    padding-bottom: 20px;
  }

  .active {
    border: 1px solid #eee;
    border-radius: 10px;
    margin-top: 10px;
    padding: 0 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  }



  .el-menu-vertical-demo:not(.el-menu--collapse) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 10;
    justify-content: space-around;
  }

  .joke-title {
    font-size:16px;
    color: #75a4d4;
  }

  .joke-content {
    font-size: 14px;
    color: #222;
    letter-spacing: 5px;
  }

  .timeBox {
    height: 20px;
    padding-bottom: 10px;
  }

  .time {
    color: #0db430;
    font-size: 14px;
    float: right;

  i {
    margin-left: 10px;
  }
  }

  img {
    width: 100%;
    height: auto;
    margin: 0 auto;
  }

  .activeImg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;

  }

  .el-menu--horizontal .el-menu-item {
    float: left;
    height: 50px;
    line-height: 50px;
    a{
      font-size: 18px;
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -160px;
    font-size: 12px;
    z-index: 10;

  }
  .el-button{
    width: 80px;
    height: 40px;
    font-size: 12px;
  }



  .goBack {
    position: fixed;
    width: 25px;
    height:25px;
    border-radius: 100%;
    bottom: 50px;
    padding:10px;
    right: 20px;
    z-index: 10;
    background: rgba(0,0,0,.2) url("../../assets/back-top.png") no-repeat center;
    background-size: 50%;
  }


  .input-box{
    position: fixed;
    top: 60px;
    left: 50%;
    width: 80%;
    height: 40px;
    margin-left: -40%;
    z-index: 10;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;

  input{
      width: 100%;
      height: 40px;
      font-size: 14px;
      text-indent: 12px;
      box-sizing: border-box;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #eee;
    outline: none;
    }
    .sure{
      position: fixed;
      top: 60px;
      right: 10%;
      width: 60px;
      height: 40px;
      background: #339999;
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 16px;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
      cursor: pointer;
      z-index: 10;
    }
  }
  .main-box{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .main-content{
    height: 100% ;
    overflow: hidden;
  }
</style>
