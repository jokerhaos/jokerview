/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2018-04-26 11:59:02
 * @LastEditTime: 2018-11-07 14:06:23
 * @LastEditors: hesenkang
 */
import Vue from 'vue';
import Config from '@/config/index.js';
/** 用来表达全局状态 */
const all = {
    loading: false,
    getMenuData: () => { // 当前角色允许看到的菜单, 格式如：'{"Member":['add','remove'], "Order":['fundinOrder', 'fundoutOrder']}'
        const localConfig = window.localStorage.getItem(Config.menuDataKey);
        if (localConfig) {
            return JSON.parse(localConfig);
        } else {
            return {};
        }
    },
    setMenuData: (menuData) => { // menuData同之上
        window.localStorage.setItem(Config.menuDataKey, menuData);
    },
    setUserInfo:(userInfo) => {
        window.localStorage.setItem(Config.userInfoKey, userInfo);
    },
    getUserInfo:() => {
        const userInfo = window.localStorage.getItem(Config.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        } else {
            return {};
        }
    },
    // 公共事件管理 同级组件事件触发使用
    bus: new Vue()
};
export default all;
