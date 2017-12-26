<template>
  <div>
    <div class="link">
      <el-menu default-active="1-3-1" class="el-menu-vertical-demo"
               mode="horizontal">

        <el-menu-item index="1" class="el-menu-item ">
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

    <div class="main">
      <ul>
        <li v-for="(item,index) in list" :class="{active:index === currentItem}" @click="click(index)">
          <h4 class="joke-title">{{(currentPage-1)*10+index}}.&nbsp;{{item.title}}</h4>
          <!--<p v-if="item.text" >{{item.text.replace(/<[^>]+>/g,"")}}</p>-->
          <p v-if="item.text" v-html="item.text" class="joke-content">{{item.text}}</p>

          <img v-else v-lazy="item.img" alt="" @click="clickImg(index)" ref="image">
          <p class="timeBox"><span class="time">生成时间:<i>{{item.ct | format}}</i></span></p>
        </li>
      </ul>
    </div>


    <footer>
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="prevPage">上一页</el-button>
        <el-button type="primary"><i class="el-icon-arrow-right el-icon--right" @click="nextPage">下一页</i></el-button>
        <el-button type="primary">共{{allPages}}页</el-button>
        <el-button type="primary">当前{{currentPage}}页</el-button>
      </el-button-group>
    </footer>


    <loading v-if="loading" :loading="loading"></loading>

  </div>
</template>

<script>
  import {joke} from '../../api/rank'
  import {commonParams} from "../../api/config";
  import loading from '../loading/loading'


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
        clickActive: false,
        // activeImg:false
      }

    },
    filters: {
      format(value) {
        if (!value) return '';
        return value.split('.')[0] + '.' + Math.round(+(value.split('.')[1]) / 10)
      }
    },
    components: {
      loading
    },
    created() {
      this.$nextTick(() => {
        this._getJoke()
        this.list.currentItem = -1
      })
    },
    mounted() {
    },
    watch: {
      $route: {
        handler(to) {
          console.log(to.params.id);
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
          setTimeout(() => {
            commonParams.page++;
            this.currentPage++;
            this.loading = false;
          }, 2000)
        });
        this.textList = '';
        this.picList = '';
        this.gifList = '';
      },
      prevPage() {
        commonParams.page--;
        const type = this.$route.params.id;
        const page = commonParams.page;
        joke(type, page).then((res) => {
          this.list = res.showapi_res_body.contentlist;
          this.currentPage--
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
      }

    },

  }
</script>

<style type="text/css" lang="scss">
  ul {
    -webkit-padding-start: 0;
    margin: 0 auto;
  }

  ul li {
    width: 90%;
    font-size: 12px;
    list-style: none;
    margin: 0 auto;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
  }

  .link {
    text-align: center;

  .el-menu-vertical-demo a.active {
    color: #303133;
  }

  }

  .main {
    margin-top: 70px;
    margin-bottom: 70px;

  ul li {
    transition: all .3s;
  }

  .active {
    border: 1px solid #eee;
    border-radius: 10px;
    margin-top: 10px;
    padding: 0 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  }

  }

  footer {
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -158px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .joke-title {
    font-size: 16px;
    color: #75a4d4;
  }

  .joke-content {
    font-size: 14px;
    color: #222;
    letter-spacing: 5px;
  }

  .timeBox {
    height: 20px;
  }

  .time {
    color: #0db430;
    font-size: 12px;
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
</style>
